/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { getSolidDataset } from "../resource/solidDataset";
import { IriString, Thing, WithServerResourceInfo } from "../interfaces";
import {
  getSourceUrl,
  internal_defaultFetchOptions,
  getResourceInfo,
} from "../resource/resource";
import { acl, rdf } from "../constants";
import { Quad } from "rdf-js";
import { DataFactory } from "../rdfjs";
import { createThing, getThingAll, removeThing } from "../thing/thing";
import { getIri, getIriAll } from "../thing/get";
import { setIri } from "../thing/set";
import { addIri } from "../thing/add";
import {
  Access,
  AclDataset,
  AclRule,
  hasAccessibleAcl,
  WithAccessibleAcl,
  WithAcl,
} from "./acl";

/**
 * This (currently internal) function fetches the ACL indicated in the [[WithServerResourceInfo]]
 * attached to a resource.
 *
 * @internal
 * @param resourceInfo The Resource info with the ACL URL
 * @param options Optional parameter `options.fetch`: An alternative `fetch` function to make the HTTP request, compatible with the browser-native [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters).
 */
export async function internal_fetchAcl(
  resourceInfo: WithServerResourceInfo,
  options: Partial<
    typeof internal_defaultFetchOptions
  > = internal_defaultFetchOptions
): Promise<WithAcl["internal_acl"]> {
  if (!hasAccessibleAcl(resourceInfo)) {
    return {
      resourceAcl: null,
      fallbackAcl: null,
    };
  }
  const resourceAcl = await internal_fetchResourceAcl(resourceInfo, options);

  const acl =
    resourceAcl === null
      ? {
          resourceAcl: null,
          fallbackAcl: await internal_fetchFallbackAcl(resourceInfo, options),
        }
      : { resourceAcl: resourceAcl, fallbackAcl: null };

  return acl;
}

/** @internal */
export async function internal_fetchResourceAcl(
  dataset: WithServerResourceInfo,
  options: Partial<
    typeof internal_defaultFetchOptions
  > = internal_defaultFetchOptions
): Promise<AclDataset | null> {
  if (!hasAccessibleAcl(dataset)) {
    return null;
  }

  try {
    const aclSolidDataset = await getSolidDataset(
      dataset.internal_resourceInfo.aclUrl,
      options
    );
    return Object.assign(aclSolidDataset, {
      internal_accessTo: getSourceUrl(dataset),
    });
  } catch (e) {
    // Since a Solid server adds a `Link` header to an ACL even if that ACL does not exist,
    // failure to fetch the ACL is expected to happen - we just return `null` and let callers deal
    // with it.
    return null;
  }
}

/** @internal */
export async function internal_fetchFallbackAcl(
  resource: WithAccessibleAcl,
  options: Partial<
    typeof internal_defaultFetchOptions
  > = internal_defaultFetchOptions
): Promise<AclDataset | null> {
  const resourceUrl = new URL(getSourceUrl(resource));
  const resourcePath = resourceUrl.pathname;
  // Note: we're currently assuming that the Origin is the root of the Pod. However, it is not yet
  //       set in stone that that will always be the case. We might need to check the Container's
  //       metadata at some point in time to check whether it is actually the root of the Pod.
  //       See: https://github.com/solid/specification/issues/153#issuecomment-624630022
  if (resourcePath === "/") {
    // We're already at the root, so there's no Container we can retrieve:
    return null;
  }

  const containerPath = internal_getContainerPath(resourcePath);
  const containerIri = new URL(containerPath, resourceUrl.origin).href;
  const containerInfo = await getResourceInfo(containerIri, options);

  if (!hasAccessibleAcl(containerInfo)) {
    // If the current user does not have access to this Container's ACL,
    // we cannot determine whether its ACL is the one that applies. Thus, return null:
    return null;
  }

  const containerAcl = await internal_fetchResourceAcl(containerInfo, options);
  if (containerAcl === null) {
    return internal_fetchFallbackAcl(containerInfo, options);
  }

  return containerAcl;
}

/**
 * Given the path to a Resource, get the URL of the Container one level up in the hierarchy.
 * @param resourcePath The path of the Resource of which we need to determine the Container's path.
 * @hidden For internal use only.
 */
export function internal_getContainerPath(resourcePath: string): string {
  const resourcePathWithoutTrailingSlash =
    resourcePath.substring(resourcePath.length - 1) === "/"
      ? resourcePath.substring(0, resourcePath.length - 1)
      : resourcePath;

  const containerPath =
    resourcePath.substring(
      0,
      resourcePathWithoutTrailingSlash.lastIndexOf("/")
    ) + "/";

  return containerPath;
}

/** @internal */
export function internal_getAclRules(aclDataset: AclDataset): AclRule[] {
  const things = getThingAll(aclDataset);
  return things.filter(isAclRule);
}

function isAclRule(thing: Thing): thing is AclRule {
  return getIriAll(thing, rdf.type).includes(acl.Authorization);
}

/** @internal */
export function internal_getResourceAclRules(aclRules: AclRule[]): AclRule[] {
  return aclRules.filter(isResourceAclRule);
}

function isResourceAclRule(aclRule: AclRule): boolean {
  return getIri(aclRule, acl.accessTo) !== null;
}

/** @internal */
export function internal_getResourceAclRulesForResource(
  aclRules: AclRule[],
  resource: IriString
): AclRule[] {
  return aclRules.filter((rule) => appliesToResource(rule, resource));
}

function appliesToResource(aclRule: AclRule, resource: IriString): boolean {
  return getIriAll(aclRule, acl.accessTo).includes(resource);
}

/** @internal */
export function internal_getDefaultAclRules(aclRules: AclRule[]): AclRule[] {
  return aclRules.filter(isDefaultAclRule);
}

function isDefaultAclRule(aclRule: AclRule): boolean {
  return (
    getIri(aclRule, acl.default) !== null ||
    getIri(aclRule, acl.defaultForNew) !== null
  );
}

/** @internal */
export function internal_getDefaultAclRulesForResource(
  aclRules: AclRule[],
  resource: IriString
): AclRule[] {
  return aclRules.filter((rule) => isDefaultForResource(rule, resource));
}

function isDefaultForResource(aclRule: AclRule, resource: IriString): boolean {
  return (
    getIriAll(aclRule, acl.default).includes(resource) ||
    getIriAll(aclRule, acl.defaultForNew).includes(resource)
  );
}

/** @internal */
export function internal_getAccess(rule: AclRule): Access {
  const ruleAccessModes = getIriAll(rule, acl.mode);
  const writeAccess = ruleAccessModes.includes(
    internal_accessModeIriStrings.write
  );
  return writeAccess
    ? {
        read: ruleAccessModes.includes(internal_accessModeIriStrings.read),
        append: true,
        write: true,
        control: ruleAccessModes.includes(
          internal_accessModeIriStrings.control
        ),
      }
    : {
        read: ruleAccessModes.includes(internal_accessModeIriStrings.read),
        append: ruleAccessModes.includes(internal_accessModeIriStrings.append),
        write: false,
        control: ruleAccessModes.includes(
          internal_accessModeIriStrings.control
        ),
      };
}

/** @internal */
export function internal_combineAccessModes(modes: Access[]): Access {
  return modes.reduce(
    (accumulator, current) => {
      const writeAccess = accumulator.write || current.write;
      return writeAccess
        ? {
            read: accumulator.read || current.read,
            append: true,
            write: true,
            control: accumulator.control || current.control,
          }
        : {
            read: accumulator.read || current.read,
            append: accumulator.append || current.append,
            write: false,
            control: accumulator.control || current.control,
          };
    },
    { read: false, append: false, write: false, control: false }
  );
}

/** @internal */
export function internal_removeEmptyAclRules<Dataset extends AclDataset>(
  aclDataset: Dataset
): Dataset {
  const aclRules = internal_getAclRules(aclDataset);
  const aclRulesToRemove = aclRules.filter(isEmptyAclRule);

  // Is this too clever? It iterates over aclRulesToRemove, one by one removing them from aclDataset.
  const updatedAclDataset = aclRulesToRemove.reduce(removeThing, aclDataset);

  return updatedAclDataset;
}

function isEmptyAclRule(aclRule: AclRule): boolean {
  // If there are Quads in there unrelated to Access Control,
  // this is not an empty ACL rule that can be deleted:
  if (Array.from(aclRule).some((quad) => !isAclQuad(quad))) {
    return false;
  }

  // If the rule does not apply to any Resource, it is no longer working:
  if (
    getIri(aclRule, acl.accessTo) === null &&
    getIri(aclRule, acl.default) === null &&
    getIri(aclRule, acl.defaultForNew) === null
  ) {
    return true;
  }

  // If the rule does not specify Access Modes, it is no longer working:
  if (getIri(aclRule, acl.mode) === null) {
    return true;
  }

  // If the rule does not specify whom it applies to, it is no longer working:
  if (
    getIri(aclRule, acl.agent) === null &&
    getIri(aclRule, acl.agentGroup) === null &&
    getIri(aclRule, acl.agentClass) === null
  ) {
    return true;
  }

  return false;
}

function isAclQuad(quad: Quad): boolean {
  const predicate = quad.predicate;
  const object = quad.object;
  if (
    predicate.equals(DataFactory.namedNode(rdf.type)) &&
    object.equals(DataFactory.namedNode(acl.Authorization))
  ) {
    return true;
  }
  if (
    predicate.equals(DataFactory.namedNode(acl.accessTo)) ||
    predicate.equals(DataFactory.namedNode(acl.default)) ||
    predicate.equals(DataFactory.namedNode(acl.defaultForNew))
  ) {
    return true;
  }
  if (
    predicate.equals(DataFactory.namedNode(acl.mode)) &&
    Object.values(internal_accessModeIriStrings).some((mode) =>
      object.equals(DataFactory.namedNode(mode))
    )
  ) {
    return true;
  }
  if (
    predicate.equals(DataFactory.namedNode(acl.agent)) ||
    predicate.equals(DataFactory.namedNode(acl.agentGroup)) ||
    predicate.equals(DataFactory.namedNode(acl.agentClass))
  ) {
    return true;
  }
  if (predicate.equals(DataFactory.namedNode(acl.origin))) {
    return true;
  }
  return false;
}

/**
 * IRIs of potential Access Modes
 * @internal
 */
export const internal_accessModeIriStrings = {
  read: "http://www.w3.org/ns/auth/acl#Read",
  append: "http://www.w3.org/ns/auth/acl#Append",
  write: "http://www.w3.org/ns/auth/acl#Write",
  control: "http://www.w3.org/ns/auth/acl#Control",
} as const;
/** @internal */
type AccessModeIriString = typeof internal_accessModeIriStrings[keyof typeof internal_accessModeIriStrings];

/** @internal
 * This function finds, among a set of ACL rules, the ones granting access to a given entity (the target)
 * and identifying it with a specific property (`acl:agent` or `acl:agentGroup`).
 * @param aclRules The set of rules to filter
 * @param targetIri The IRI of the target
 * @param targetType The property linking the rule to the target
 */
export function internal_getAclRulesForIri(
  aclRules: AclRule[],
  targetIri: IriString,
  targetType: typeof acl.agent | typeof acl.agentGroup
): AclRule[] {
  return aclRules.filter((rule) =>
    getIriAll(rule, targetType).includes(targetIri)
  );
}

/** @internal
 * This function transforms a given set of rules into a map associating the IRIs
 * of the entities to which permissions are granted by these rules, and the permissions
 * granted to them. Additionally, it filters these entities based on the predicate
 * that refers to them in the rule.
 */
export function internal_getAccessByIri(
  aclRules: AclRule[],
  targetType: typeof acl.agent | typeof acl.agentGroup
): Record<IriString, Access> {
  const targetIriAccess: Record<IriString, Access> = {};

  aclRules.forEach((rule) => {
    const ruleTargetIri = getIriAll(rule, targetType);
    const access = internal_getAccess(rule);

    // A rule might apply to multiple agents. If multiple rules apply to the same agent, the Access
    // Modes granted by those rules should be combined:
    ruleTargetIri.forEach((targetIri) => {
      targetIriAccess[targetIri] =
        typeof targetIriAccess[targetIri] === "undefined"
          ? access
          : internal_combineAccessModes([targetIriAccess[targetIri], access]);
    });
  });
  return targetIriAccess;
}

/**
 * Initialises a new ACL Rule that grants some access - but does not yet specify to whom.
 *
 * @hidden This is an internal utility function that should not be used directly by downstreams.
 * @param access Access mode that this Rule will grant
 */
export function internal_initialiseAclRule(access: Access): AclRule {
  let newRule = createThing();
  newRule = setIri(newRule, rdf.type, acl.Authorization);
  if (access.read) {
    newRule = addIri(newRule, acl.mode, internal_accessModeIriStrings.read);
  }
  if (access.append && !access.write) {
    newRule = addIri(newRule, acl.mode, internal_accessModeIriStrings.append);
  }
  if (access.write) {
    newRule = addIri(newRule, acl.mode, internal_accessModeIriStrings.write);
  }
  if (access.control) {
    newRule = addIri(newRule, acl.mode, internal_accessModeIriStrings.control);
  }
  return newRule;
}

/**
 * Creates a new ACL Rule with the same ACL values as the input ACL Rule, but having a different IRI.
 *
 * Note that non-ACL values will not be copied over.
 *
 * @hidden This is an internal utility function that should not be used directly by downstreams.
 * @param sourceRule ACL rule to duplicate.
 */
export function internal_duplicateAclRule(sourceRule: AclRule): AclRule {
  let targetRule = createThing();
  targetRule = setIri(targetRule, rdf.type, acl.Authorization);

  function copyIris(
    inputRule: typeof sourceRule,
    outputRule: typeof targetRule,
    predicate: IriString
  ) {
    return getIriAll(inputRule, predicate).reduce(
      (outputRule, iriTarget) => addIri(outputRule, predicate, iriTarget),
      outputRule
    );
  }

  targetRule = copyIris(sourceRule, targetRule, acl.accessTo);
  targetRule = copyIris(sourceRule, targetRule, acl.default);
  targetRule = copyIris(sourceRule, targetRule, acl.defaultForNew);
  targetRule = copyIris(sourceRule, targetRule, acl.agent);
  targetRule = copyIris(sourceRule, targetRule, acl.agentGroup);
  targetRule = copyIris(sourceRule, targetRule, acl.agentClass);
  targetRule = copyIris(sourceRule, targetRule, acl.origin);
  targetRule = copyIris(sourceRule, targetRule, acl.mode);

  return targetRule;
}
