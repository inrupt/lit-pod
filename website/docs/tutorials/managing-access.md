---
id: managing-access
title: Managing Access to Data
sidebar_label: Managing Access
---

:::warning

The Solid specification has not settled yet, and access management specifically is expected to
change in the future.

As a result, the API's described here are expected to change as well.
Hence, all functions are marked as `unstable_` and may break in future non-major releases.

:::

## Access Control in Solid

In Solid, who has what access to a [Resource](../glossary#resource) is defined in an Access Control
List ([ACL](../glossary#acl)). These may be defined in separate Resources, so if you want to be able
to access the ACLs for a Resource in addition to the Resource itself, you'll have to explicitly
fetch them using
[`unstable_fetchLitDatasetWithAcl`](../api/modules/_litdataset_#unstable_fetchlitdatasetwithacl) —
but be aware that this may result in several extra HTTP requests being sent.

The possible [Access Modes](../glossary#access-modes) that can be granted are
[Read](../glossary#read-access), [Append](../glossary#append-access),
[Write](../glossary#write-access) and [Control](../glossary#control-access),

:::note A note about access to ACLs

A Resource's or Container's ACL is only accessible to your app if the following are true:

1. The authenticated user must have authorised your app to manage access on their behalf. At the
   time of writing, the most common Solid server has that permission unchecked by default, i.e.
   users will need to have actively given your app this permission.
2. The authenticated user should have [Control access](../glossary#control-access) to the
   applicable Resource or Container.

:::

## Finding out who has access

Access can be granted to individual [agents](../glossary#agent), to groups, or even to everyone.
We currently only support reading what access has been granted to individual agents specifically.

### Fetching access information

There are two main ways of checking the access information of a Resource:

1. Fetch the entire Resource, data and information at once. To do so, use the functions
   `unstable_fetchFile` or `unstable_fetchLitDatasetWithAcl`. The returned value includes both the Resource
   data (e.g. your profile or friend list), the `ResourceInfo`, and the ACL containing the associated
   access information.
2. Fetch only the information about a Resource, without fetching the Resource itself
   with `fetchResourceInfo`, and then fetching the associated ACL (if any).

### Reading agent access

Given a [LitDataset](../glossary#litdataset) that has an ACL attached, you can check what access a
specific agent has been granted, or get all agents for which access has been explicitly granted.

To do the former, use
[`unstable_getAgentAccessModesOne`](../api/modules/_acl_agent_#unstable_getagentaccessmodesone):

```typescript
import {
  unstable_fetchLitDatasetWithAcl,
  unstable_getAgentAccessModesOne,
} from "@solid/lit-pod";

const webId = "https://example.com/profile#webid";
const litDatasetWithAcl = await unstable_fetchLitDatasetWithAcl(
  "https://example.com"
);
const agentAccess = unstable_getAgentAccessModesOne(
  litDatasetWithAcl.acl,
  webId
);

// => an object like
//    { read: true, append: false, write: false, control: true }
//    or null if the ACL is not accessible to the current user.
```

To get all agent to whom access was granted, use
[`unstable_getAgentAccessModesAll`](../api/modules/_acl_agent_#unstable_getagentaccessmodesall):

```typescript
import {
  unstable_fetchLitDatasetWithAcl,
  unstable_getAgentAccessModesAll,
} from "@solid/lit-pod";

const litDatasetWithAcl = await unstable_fetchLitDatasetWithAcl(
  "https://example.com"
);
const accessByAgent = unstable_getAgentAccessModesAll(litDatasetWithAcl.acl);

// => an object like
//    {
//      "https://example.com/profile#webid":
//        { read: true, append: false, write: false, control: true },
//      "https://example.com/other-profile#webid":
//        { read: true, append: false, write: false, control: false },
//    }
```

## Changing who has access

:::caution

This section is still being written.

:::

### Two types of ACL

A Resource _can_ have an ACL that applies to just that Resource. However, if no such ACL exists, the
Pod server will fall back to the ACL of its [Container](../glossary#container) — or its Container's
Container's, or its Container's Container's Container's, etc.

Thus, an ACL can control both access to a specific Resource or Container directly, and provide
_default_ access rules: those that apply to the _children_ of the applicable Container when it
serves as their fallback ACL. Note that the Container's _Resource_ access rules will _not_ apply to
its children.
