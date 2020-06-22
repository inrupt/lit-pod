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

import { acl, rdf } from "./constants";
import {
  fetchLitDataset,
  defaultFetchOptions,
  fetchResourceInfo,
} from "./litDataset";
import {
  WithResourceInfo,
  unstable_AclDataset,
  unstable_hasAccessibleAcl,
  unstable_AclRule,
  unstable_AccessModes,
  Thing,
  IriString,
  unstable_WithAcl,
} from "./interfaces";
import { getThingAll } from "./thing";
import { getIriOne, getIriAll } from "./thing/get";

/** @internal */
export async function internal_fetchResourceAcl(
  dataset: WithResourceInfo,
  options: Partial<typeof defaultFetchOptions> = defaultFetchOptions
): Promise<unstable_AclDataset | null> {
  if (!unstable_hasAccessibleAcl(dataset)) {
    return null;
  }

  try {
    const aclLitDataset = await fetchLitDataset(
      dataset.resourceInfo.unstable_aclUrl,
      options
    );
    return Object.assign(aclLitDataset, {
      accessTo: dataset.resourceInfo.fetchedFrom,
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
  dataset: WithResourceInfo & {
    resourceInfo: {
      unstable_aclUrl: Exclude<
        WithResourceInfo["resourceInfo"]["unstable_aclUrl"],
        undefined
      >;
    };
  },
  options: Partial<typeof defaultFetchOptions> = defaultFetchOptions
): Promise<unstable_AclDataset | null> {
  const resourceUrl = new URL(dataset.resourceInfo.fetchedFrom);
  const resourcePath = resourceUrl.pathname;
  // Note: we're currently assuming that the Origin is the root of the Pod. However, it is not yet
  //       set in stone that that will always be the case. We might need to check the Container's
  //       metadata at some point in time to check whether it is actually the root of the Pod.
  //       See: https://github.com/solid/specification/issues/153#issuecomment-624630022
  if (resourcePath === "/") {
    // We're already at the root, so there's no Container we can retrieve:
    return null;
  }

  const containerPath = getContainerPath(resourcePath);
  const containerIri = new URL(containerPath, resourceUrl.origin).href;
  const containerInfo = await fetchResourceInfo(containerIri, options);

  if (!unstable_hasAccessibleAcl(containerInfo)) {
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

function getContainerPath(resourcePath: string): string {
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

/**
 * Verify whether an ACL was found for the given Resource.
 *
 * A Resource fetched with its ACL (e.g. using [[unstable_fetchLitDatasetWithAcl]]) _might_ have a resource ACL attached, but
 * we cannot be sure: it might be that none exists for this specific Resource (in which case the
 * fallback ACL applies), or the currently authenticated user (if any) might not have Control access
 * to the fetched Resource.
 *
 * This function verifies that the Resource's ACL is accessible.
 *
 * @param resource A Resource that might have an ACL attached.
 * @returns Whether `dataset` has an ACL attached.
 */
export function unstable_hasResourceAcl<Resource extends unstable_WithAcl>(
  resource: Resource
): resource is Resource & {
  acl: {
    resourceAcl: Exclude<unstable_WithAcl["acl"]["resourceAcl"], null>;
  };
} {
  return resource.acl.resourceAcl !== null;
}

/**
 * Access the ACL attached to a Resource.
 *
 * Given a Resource that has an ACL attached, this function will give you access to that ACL. To
 * verify whether the ACL is available, see [[unstable_hasResourceAcl]].
 *
 * @param resource A Resource with potentially an ACL attached.
 * @returns The ACL, if available, and undefined if not.
 */
export function unstable_getResourceAcl(
  resource: unstable_WithAcl & {
    acl: {
      resourceAcl: Exclude<unstable_WithAcl["acl"]["resourceAcl"], null>;
    };
  }
): unstable_AclDataset;
export function unstable_getResourceAcl(
  resource: unstable_WithAcl
): unstable_AclDataset | null;
export function unstable_getResourceAcl(
  resource: unstable_WithAcl
): unstable_AclDataset | null {
  if (!unstable_hasResourceAcl(resource)) {
    return null;
  }
  return resource.acl.resourceAcl;
}

/**
 * Verify whether a fallback ACL was found for the given Resource.
 *
 * A Resource fetched with its ACL (e.g. using [[unstable_fetchLitDatasetWithAcl]]) _might_ have a fallback ACL
 * attached, but we cannot be sure: the currently authenticated user (if any) might not have Control
 * access to one of the fetched Resource's Containers.
 *
 * This function verifies that the fallback ACL is accessible.
 *
 * @param resource A [[LitDataset]] that might have a fallback ACL attached.
 * @returns Whether `dataset` has a fallback ACL attached.
 */
export function unstable_hasFallbackAcl<Resource extends unstable_WithAcl>(
  resource: Resource
): resource is Resource & {
  acl: {
    fallbackAcl: Exclude<unstable_WithAcl["acl"]["fallbackAcl"], null>;
  };
} {
  return resource.acl.fallbackAcl !== null;
}

/**
 * Access the fallback ACL attached to a Resource.
 *
 * Given a Resource that has a fallback ACL attached, this function will give you access to that
 * ACL. To verify whether the fallback ACL is available, see [[unstable_hasFallbackAcl]].
 *
 * @param resource A Resource with potentially a fallback ACL attached.
 * @returns The fallback ACL, or null if it coult not be accessed.
 */
export function unstable_getFallbackAcl(
  resource: unstable_WithAcl & {
    acl: {
      fallbackAcl: Exclude<unstable_WithAcl["acl"]["fallbackAcl"], null>;
    };
  }
): unstable_AclDataset;
export function unstable_getFallbackAcl(
  dataset: unstable_WithAcl
): unstable_AclDataset | null;
export function unstable_getFallbackAcl(
  dataset: unstable_WithAcl
): unstable_AclDataset | null {
  if (!unstable_hasFallbackAcl(dataset)) {
    return null;
  }
  return dataset.acl.fallbackAcl;
}

/** @internal */
export function internal_getAclRules(
  aclDataset: unstable_AclDataset
): unstable_AclRule[] {
  const things = getThingAll(aclDataset);
  return things.filter(isAclRule);
}

function isAclRule(thing: Thing): thing is unstable_AclRule {
  return getIriAll(thing, rdf.type).includes(acl.Authorization);
}

/** @internal */
export function internal_getResourceAclRules(
  aclRules: unstable_AclRule[]
): unstable_AclRule[] {
  return aclRules.filter(isResourceAclRule);
}

function isResourceAclRule(aclRule: unstable_AclRule): boolean {
  return getIriOne(aclRule, acl.accessTo) !== null;
}

/** @internal */
export function internal_getResourceAclRulesForResource(
  aclRules: unstable_AclRule[],
  resource: IriString
): unstable_AclRule[] {
  return aclRules.filter((rule) => appliesToResource(rule, resource));
}

function appliesToResource(
  aclRule: unstable_AclRule,
  resource: IriString
): boolean {
  return getIriAll(aclRule, acl.accessTo).includes(resource);
}

/** @internal */
export function internal_getDefaultAclRules(
  aclRules: unstable_AclRule[]
): unstable_AclRule[] {
  return aclRules.filter(isDefaultAclRule);
}

function isDefaultAclRule(aclRule: unstable_AclRule): boolean {
  return getIriOne(aclRule, acl.default) !== null;
}

/** @internal */
export function internal_getDefaultAclRulesForResource(
  aclRules: unstable_AclRule[],
  resource: IriString
): unstable_AclRule[] {
  return aclRules.filter((rule) => isDefaultForResource(rule, resource));
}

function isDefaultForResource(
  aclRule: unstable_AclRule,
  resource: IriString
): boolean {
  return getIriAll(aclRule, acl.default).includes(resource);
}

/** @internal */
export function internal_getAccessModes(
  rule: unstable_AclRule
): unstable_AccessModes {
  const ruleAccessModes = getIriAll(rule, acl.mode);
  const writeAccess = ruleAccessModes.includes(accessModeIriStrings.write);
  return writeAccess
    ? {
        read: ruleAccessModes.includes(accessModeIriStrings.read),
        append: true,
        write: true,
        control: ruleAccessModes.includes(accessModeIriStrings.control),
      }
    : {
        read: ruleAccessModes.includes(accessModeIriStrings.read),
        append: ruleAccessModes.includes(accessModeIriStrings.append),
        write: false,
        control: ruleAccessModes.includes(accessModeIriStrings.control),
      };
}

/** @internal */
export function internal_combineAccessModes(
  modes: unstable_AccessModes[]
): unstable_AccessModes {
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

/**
 * IRIs of potential Access Modes
 * @internal
 */
const accessModeIriStrings = {
  read: "http://www.w3.org/ns/auth/acl#Read",
  append: "http://www.w3.org/ns/auth/acl#Append",
  write: "http://www.w3.org/ns/auth/acl#Write",
  control: "http://www.w3.org/ns/auth/acl#Control",
} as const;
/** @internal */
type AccessModeIriString = typeof accessModeIriStrings[keyof typeof accessModeIriStrings];
