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

// TODO: These should be replaced by auto-generated constants,
//       if we can ensure that unused constants will be excluded from bundles.

/** @hidden */
export const acl = {
  Authorization: "http://www.w3.org/ns/auth/acl#Authorization",
  AuthenticatedAgent: "http://www.w3.org/ns/auth/acl#AuthenticatedAgent",
  accessTo: "http://www.w3.org/ns/auth/acl#accessTo",
  agent: "http://www.w3.org/ns/auth/acl#agent",
  agentGroup: "http://www.w3.org/ns/auth/acl#agentGroup",
  agentClass: "http://www.w3.org/ns/auth/acl#agentClass",
  default: "http://www.w3.org/ns/auth/acl#default",
  defaultForNew: "http://www.w3.org/ns/auth/acl#defaultForNew",
  mode: "http://www.w3.org/ns/auth/acl#mode",
  origin: "http://www.w3.org/ns/auth/acl#origin",
} as const;

/** @hidden */
export const rdf = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
} as const;

/** @hidden */
export const ldp = {
  BasicContainer: "http://www.w3.org/ns/ldp#BasicContainer",
  Container: "http://www.w3.org/ns/ldp#Container",
  Resource: "http://www.w3.org/ns/ldp#Resource",
  contains: "http://www.w3.org/ns/ldp#contains",
} as const;

/** @hidden */
export const foaf = {
  Agent: "http://xmlns.com/foaf/0.1/Agent",
} as const;

/** @hidden */
export const acp = {
  Policy: "http://www.w3.org/ns/solid/acp#Policy",
  AccessControl: "http://www.w3.org/ns/solid/acp#AccessControl",
  Read: "http://www.w3.org/ns/solid/acp#Read",
  Append: "http://www.w3.org/ns/solid/acp#Append",
  Write: "http://www.w3.org/ns/solid/acp#Write",
  Rule: "http://www.w3.org/ns/solid/acp#Rule",
  accessControl: "http://www.w3.org/ns/solid/acp#accessControl",
  apply: "http://www.w3.org/ns/solid/acp#apply",
  applyMembers: "http://www.w3.org/ns/solid/acp#applyMembers",
  allow: "http://www.w3.org/ns/solid/acp#allow",
  deny: "http://www.w3.org/ns/solid/acp#deny",
  allOf: "http://www.w3.org/ns/solid/acp#allOf",
  anyOf: "http://www.w3.org/ns/solid/acp#anyOf",
  noneOf: "http://www.w3.org/ns/solid/acp#noneOf",
  access: "http://www.w3.org/ns/solid/acp#access",
  accessMembers: "http://www.w3.org/ns/solid/acp#accessMembers",
  agent: "http://www.w3.org/ns/solid/acp#agent",
  group: "http://www.w3.org/ns/solid/acp#group",
  PublicAgent: "http://www.w3.org/ns/solid/acp#PublicAgent",
  AuthenticatedAgent: "http://www.w3.org/ns/solid/acp#AuthenticatedAgent",
  CreatorAgent: "http://www.w3.org/ns/solid/acp#CreatorAgent",
} as const;
