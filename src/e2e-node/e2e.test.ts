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

/**
 * @jest-environment node
 */

import { foaf, schema } from "rdf-namespaces";
import { Session } from "@inrupt/solid-client-authn-node";
import { config } from "dotenv-flow";
import {
  getSolidDataset,
  setThing,
  getThing,
  getStringNoLocale,
  setDatetime,
  setStringNoLocale,
  saveSolidDatasetAt,
  overwriteFile,
  isRawData,
  getContentType,
  getResourceInfoWithAcl,
  getSolidDatasetWithAcl,
  hasResourceAcl,
  getPublicAccess,
  getAgentAccess,
  getFallbackAcl,
  getResourceAcl,
  getAgentResourceAccess,
  setAgentResourceAccess,
  saveAclFor,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getPublicDefaultAccess,
  getPublicResourceAccess,
  getFile,
  getSourceUrl,
  deleteFile,
  createContainerAt,
  createContainerInContainer,
  getBoolean,
  setBoolean,
  createThing,
  createSolidDataset,
  deleteSolidDataset,
  UrlString,
  acp_v2 as acp,
} from "../index";
import openidClient from "openid-client";

// This block of end-to-end tests should be removed once solid-client-authn-node works against NSS,
// and the other `describe` block has credentials for an NSS server:
describe.each([
  ["https://lit-e2e-test.inrupt.net/public/"],
  // Since ESS switched to ACPs we no longer have a convenient way to prepare the tests data
  // with the proper permissions (i.e. public-read-write).
  // Therefore, end-to-end tests against ESS have been disabled for now.
  // We can re-enable them once we have a Node library with which we can authenticate,
  // after which we can set the relevant permissions in the tests themselves:
  // ["https://ldp.demo-ess.inrupt.com/105177326598249077653/test-data/"],
])("End-to-end tests with pre-existing data against %s", (rootContainer) => {
  it("should be able to read and update data in a Pod", async () => {
    const randomNick = "Random nick " + Math.random();

    const dataset = await getSolidDataset(`${rootContainer}lit-pod-test.ttl`);
    const existingThing = getThing(
      dataset,
      `${rootContainer}lit-pod-test.ttl#thing1`
    );

    if (existingThing === null) {
      throw new Error(
        `The test data did not look like we expected it to. Check whether [${rootContainer}lit-pod-test.ttl#thing1] exists.`
      );
    }

    expect(getStringNoLocale(existingThing, foaf.name)).toBe(
      "Thing for first end-to-end test"
    );

    let updatedThing = setDatetime(
      existingThing,
      schema.dateModified,
      new Date()
    );
    updatedThing = setStringNoLocale(updatedThing, foaf.nick, randomNick);

    const updatedDataset = setThing(dataset, updatedThing);
    const savedDataset = await saveSolidDatasetAt(
      `${rootContainer}lit-pod-test.ttl`,
      updatedDataset
    );

    const savedThing = getThing(
      savedDataset,
      `${rootContainer}lit-pod-test.ttl#thing1`
    );
    expect(savedThing).not.toBeNull();
    expect(getStringNoLocale(savedThing!, foaf.name)).toBe(
      "Thing for first end-to-end test"
    );
    expect(getStringNoLocale(savedThing!, foaf.nick)).toBe(randomNick);
  });

  // FIXME: An NSS bug prevents it from understand our changing of booleans,
  // and thus causes this test to fail.
  // Once the bug is fixed, it can be enabled for NSS again.
  // See https://github.com/solid/node-solid-server/issues/1468.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("can read and write booleans", async () => {
    const dataset = await getSolidDataset(`${rootContainer}lit-pod-test.ttl`);
    const existingThing = getThing(
      dataset,
      `${rootContainer}lit-pod-test.ttl#thing2`
    );

    if (existingThing === null) {
      throw new Error(
        `The test data did not look like we expected it to. Check whether [${rootContainer}lit-pod-test.ttl#thing2] exists.`
      );
    }

    const currentValue = getBoolean(
      existingThing,
      "https://example.com/boolean"
    );
    const updatedThing = setBoolean(
      existingThing,
      "https://example.com/boolean",
      !currentValue
    );

    const updatedDataset = setThing(dataset, updatedThing);
    const savedDataset = await saveSolidDatasetAt(
      `${rootContainer}lit-pod-test.ttl`,
      updatedDataset
    );

    const savedThing = getThing(
      savedDataset,
      `${rootContainer}lit-pod-test.ttl#thing2`
    );

    expect(savedThing).not.toBeNull();
    expect(getBoolean(savedThing!, "https://example.com/boolean")).toBe(
      !currentValue
    );
  });

  it("can differentiate between RDF and non-RDF Resources", async () => {
    const rdfResourceInfo = await getResourceInfoWithAcl(
      `${rootContainer}lit-pod-resource-info-test/litdataset.ttl`
    );
    const nonRdfResourceInfo = await getResourceInfoWithAcl(
      `${rootContainer}lit-pod-resource-info-test/not-a-litdataset.png`
    );
    expect(isRawData(rdfResourceInfo)).toBe(false);
    expect(isRawData(nonRdfResourceInfo)).toBe(true);
  });

  it("can create and remove empty Containers", async () => {
    const newContainer1 = await createContainerAt(
      `${rootContainer}container-test/some-container/`
    );
    const newContainer2 = await createContainerInContainer(
      "https://lit-e2e-test.inrupt.net/public/container-test/",
      { slugSuggestion: "some-other-container" }
    );

    expect(getSourceUrl(newContainer1)).toBe(
      `${rootContainer}container-test/some-container/`
    );

    await deleteFile(`${rootContainer}container-test/some-container/`);
    await deleteFile(getSourceUrl(newContainer2));
  });

  it("should be able to read and update ACLs", async () => {
    const fakeWebId =
      "https://example.com/fake-webid#" +
      Date.now().toString() +
      Math.random().toString();

    const datasetWithAcl = await getSolidDatasetWithAcl(
      `${rootContainer}lit-pod-acl-test/passthrough-container/resource-with-acl.ttl`
    );
    const datasetWithoutAcl = await getSolidDatasetWithAcl(
      `${rootContainer}lit-pod-acl-test/passthrough-container/resource-without-acl.ttl`
    );

    expect(hasResourceAcl(datasetWithAcl)).toBe(true);
    expect(hasResourceAcl(datasetWithoutAcl)).toBe(false);
    expect(getPublicAccess(datasetWithAcl)).toEqual({
      read: true,
      append: true,
      write: true,
      control: true,
    });
    expect(
      getAgentAccess(
        datasetWithAcl,
        "https://vincentt.inrupt.net/profile/card#me"
      )
    ).toEqual({
      read: false,
      append: true,
      write: false,
      control: false,
    });
    expect(
      getAgentAccess(
        datasetWithoutAcl,
        "https://vincentt.inrupt.net/profile/card#me"
      )
    ).toEqual({
      read: true,
      append: false,
      write: false,
      control: false,
    });
    const fallbackAclForDatasetWithoutAcl = getFallbackAcl(datasetWithoutAcl);
    expect(fallbackAclForDatasetWithoutAcl?.internal_accessTo).toBe(
      `${rootContainer}lit-pod-acl-test/`
    );

    if (!hasResourceAcl(datasetWithAcl)) {
      throw new Error(
        `The Resource at ${rootContainer}lit-pod-acl-test/passthrough-container/resource-with-acl.ttl does not seem to have an ACL. The end-to-end tests do expect it to have one.`
      );
    }
    const acl = getResourceAcl(datasetWithAcl);
    const updatedAcl = setAgentResourceAccess(acl, fakeWebId, {
      read: true,
      append: false,
      write: false,
      control: false,
    });
    const savedAcl = await saveAclFor(datasetWithAcl, updatedAcl);
    const fakeWebIdAccess = getAgentResourceAccess(savedAcl, fakeWebId);
    expect(fakeWebIdAccess).toEqual({
      read: true,
      append: false,
      write: false,
      control: false,
    });

    // Cleanup
    const cleanedAcl = setAgentResourceAccess(savedAcl, fakeWebId, {
      read: false,
      append: false,
      write: false,
      control: false,
    });
    await saveAclFor(datasetWithAcl, cleanedAcl);
  });

  it("can copy default rules from the fallback ACL as Resource rules to a new ACL", async () => {
    const dataset = await getSolidDatasetWithAcl(
      `${rootContainer}lit-pod-acl-initialisation-test/resource.ttl`
    );
    if (
      !hasFallbackAcl(dataset) ||
      !hasAccessibleAcl(dataset) ||
      hasResourceAcl(dataset)
    ) {
      throw new Error(
        `The Resource at ${rootContainer}lit-pod-acl-initialisation-test/resource.ttl appears to not have an accessible fallback ACL, or it already has an ACL, which the end-to-end tests do not expect.`
      );
    }
    const newResourceAcl = createAclFromFallbackAcl(dataset);
    const existingFallbackAcl = getFallbackAcl(dataset);
    expect(getPublicDefaultAccess(existingFallbackAcl)).toEqual(
      getPublicResourceAccess(newResourceAcl)
    );
  });

  it("can fetch a non-RDF file and its metadata", async () => {
    const jsonFile = await getFile(`${rootContainer}arbitrary.json`);

    expect(getContentType(jsonFile)).toEqual("application/json");

    const data = JSON.parse(await jsonFile.text());
    expect(data).toEqual({ arbitrary: "json data" });
  });
});

// Load environment variables from .env.local if available:
config({ path: __dirname });

type OidcIssuer = string;
type ClientId = string;
type ClientSecret = string;
type RefreshToken = string;
type Pod = string;
type AuthDetails = [Pod, OidcIssuer, ClientId, ClientSecret, RefreshToken];
// Instructions for obtaining these credentials can be found here:
// https://github.com/inrupt/solid-client-authn-js/blob/1a97ef79057941d8ac4dc328fff18333eaaeb5d1/packages/node/example/bootstrappedApp/README.md
const serversUnderTest: AuthDetails[] = [
  // pod.inrupt.com:
  [
    process.env.E2E_TEST_ESS_POD!,
    process.env.E2E_TEST_ESS_IDP_URL!,
    process.env.E2E_TEST_ESS_CLIENT_ID!,
    process.env.E2E_TEST_ESS_CLIENT_SECRET!,
    process.env.E2E_TEST_ESS_REFRESH_TOKEN!,
  ],
  // pod-compat.inrupt.com:
  [
    process.env.E2E_TEST_ESS_COMPAT_POD!,
    process.env.E2E_TEST_ESS_COMPAT_IDP_URL!,
    process.env.E2E_TEST_ESS_COMPAT_CLIENT_ID!,
    process.env.E2E_TEST_ESS_COMPAT_CLIENT_SECRET!,
    process.env.E2E_TEST_ESS_COMPAT_REFRESH_TOKEN!,
  ],
  // inrupt.net
  // Unfortunately we cannot authenticate against Node Solid Server yet, due to this issue:
  // https://github.com/solid/node-solid-server/issues/1533
  // Once that is fixed, credentials can be added here, and the other `describe()` can be removed.
];

describe.each(serversUnderTest)(
  "Authenticated end-to-end tests against %s",
  (rootContainer, oidcIssuer, clientId, clientSecret, refreshToken) => {
    async function getSession() {
      const session = new Session();
      await session.login({
        oidcIssuer: oidcIssuer,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      });
      return session;
    }

    if (rootContainer.includes("pod-compat.inrupt.com")) {
      // pod-compat.inrupt.com seems to be experiencing some slowdowns processing POST requests,
      // so temporarily increase the timeouts for it:
      jest.setTimeout(30000);
      openidClient.custom.setHttpOptionsDefaults({ timeout: 5000 });
    }

    it("can create, read, update and delete data", async () => {
      const session = await getSession();
      const arbitraryPredicate = "https://arbitrary.vocab/predicate";

      let newThing = createThing({ name: "e2e-test-thing" });
      newThing = setBoolean(newThing, arbitraryPredicate, true);
      let newDataset = createSolidDataset();
      newDataset = setThing(newDataset, newThing);

      const datasetUrl = `${rootContainer}solid-client-tests/node/crud-dataset-${session.info.sessionId}.ttl`;
      await saveSolidDatasetAt(datasetUrl, newDataset, {
        fetch: session.fetch,
      });

      const firstSavedDataset = await getSolidDataset(datasetUrl, {
        fetch: session.fetch,
      });
      const firstSavedThing = getThing(
        firstSavedDataset,
        datasetUrl + "#e2e-test-thing"
      )!;
      expect(firstSavedThing).not.toBeNull();
      expect(getBoolean(firstSavedThing, arbitraryPredicate)).toBe(true);

      const updatedThing = setBoolean(
        firstSavedThing,
        arbitraryPredicate,
        false
      );
      const updatedDataset = setThing(firstSavedDataset, updatedThing);
      await saveSolidDatasetAt(datasetUrl, updatedDataset, {
        fetch: session.fetch,
      });

      const secondSavedDataset = await getSolidDataset(datasetUrl, {
        fetch: session.fetch,
      });
      const secondSavedThing = getThing(
        secondSavedDataset,
        datasetUrl + "#e2e-test-thing"
      )!;
      expect(secondSavedThing).not.toBeNull();
      expect(getBoolean(secondSavedThing, arbitraryPredicate)).toBe(false);

      await deleteSolidDataset(datasetUrl, { fetch: session.fetch });
      await expect(() =>
        getSolidDataset(datasetUrl, { fetch: session.fetch })
      ).rejects.toEqual(
        expect.objectContaining({
          statusCode: 404,
        })
      );
    });

    it("can create, delete, and differentiate between RDF and non-RDF Resources", async () => {
      const session = await getSession();
      const datasetUrl = `${rootContainer}solid-client-tests/node/dataset-${session.info.sessionId}.ttl`;
      const fileUrl = `${rootContainer}solid-client-tests/node/file-${session.info.sessionId}.txt`;

      const sentFile = await overwriteFile(fileUrl, Buffer.from("test"), {
        fetch: session.fetch,
      });
      const sentDataset = await saveSolidDatasetAt(
        datasetUrl,
        createSolidDataset(),
        { fetch: session.fetch }
      );

      expect(isRawData(sentDataset)).toBe(false);
      expect(isRawData(sentFile)).toBe(true);

      await deleteSolidDataset(datasetUrl, { fetch: session.fetch });
      await deleteFile(fileUrl, { fetch: session.fetch });
    });

    it("can create and remove Containers", async () => {
      const session = await getSession();
      const containerUrl = `${rootContainer}solid-client-tests/node/container-test/container1-${session.info.sessionId}/`;
      const containerContainerUrl = `${rootContainer}solid-client-tests/node/container-test/`;
      const containerName = `container2-${session.info.sessionId}`;
      const newContainer1 = await createContainerAt(containerUrl, {
        fetch: session.fetch,
      });
      const newContainer2 = await createContainerInContainer(
        containerContainerUrl,
        { slugSuggestion: containerName, fetch: session.fetch }
      );

      expect(getSourceUrl(newContainer1)).toBe(containerUrl);
      expect(getSourceUrl(newContainer2)).toBe(
        `${containerContainerUrl}${containerName}/`
      );

      await deleteFile(containerUrl, { fetch: session.fetch });
      await deleteFile(getSourceUrl(newContainer2), { fetch: session.fetch });
      await deleteFile(containerContainerUrl, { fetch: session.fetch });
    });

    it("can read and update ACLs", async () => {
      if (rootContainer.includes("pod.inrupt.com")) {
        // pod.inrupt.com does not support WAC, so skip this test there.
        return;
      }
      const session = await getSession();
      const fakeWebId =
        "https://example.com/fake-webid#" + session.info.sessionId;
      // solid-client-authn-node does not, at the time of writing, return the WebID after a login
      // using the refresh token, but it will be updated to do so.
      // Hence, the appending of "profile/card#me" is a hack that will become redundant in time.
      const ownWebId = session.info.webId ?? rootContainer + "profile/card#me";
      const datasetWithoutAclUrl = `${rootContainer}solid-client-tests/node/acl-test-${session.info.sessionId}.ttl`;
      await saveSolidDatasetAt(datasetWithoutAclUrl, createSolidDataset(), {
        fetch: session.fetch,
      });

      const datasetWithAcl = await getSolidDatasetWithAcl(rootContainer, {
        fetch: session.fetch,
      });
      const datasetWithoutAcl = await getSolidDatasetWithAcl(
        datasetWithoutAclUrl,
        { fetch: session.fetch }
      );

      expect(hasResourceAcl(datasetWithAcl)).toBe(true);
      expect(hasResourceAcl(datasetWithoutAcl)).toBe(false);

      expect(getPublicAccess(datasetWithAcl)).toEqual({
        read: false,
        append: false,
        write: false,
        control: false,
      });
      expect(getAgentAccess(datasetWithAcl, session.info.webId!)).toEqual({
        read: true,
        append: true,
        write: true,
        control: true,
      });
      expect(getAgentAccess(datasetWithoutAcl, session.info.webId!)).toEqual({
        read: true,
        append: true,
        write: true,
        control: true,
      });
      const fallbackAclForDatasetWithoutAcl = getFallbackAcl(datasetWithoutAcl);
      expect(fallbackAclForDatasetWithoutAcl?.internal_accessTo).toBe(
        rootContainer
      );

      if (!hasResourceAcl(datasetWithAcl)) {
        throw new Error(
          `The Resource at [${rootContainer}] does not seem to have an ACL. The end-to-end tests do expect it to have one.`
        );
      }
      const acl = getResourceAcl(datasetWithAcl);
      const updatedAcl = setAgentResourceAccess(acl, fakeWebId, {
        read: true,
        append: false,
        write: false,
        control: false,
      });
      const sentAcl = await saveAclFor(datasetWithAcl, updatedAcl, {
        fetch: session.fetch,
      });
      const fakeWebIdAccess = getAgentResourceAccess(sentAcl, fakeWebId);
      expect(fakeWebIdAccess).toEqual({
        read: true,
        append: false,
        write: false,
        control: false,
      });

      // Cleanup
      const cleanedAcl = setAgentResourceAccess(sentAcl, fakeWebId, {
        read: false,
        append: false,
        write: false,
        control: false,
      });
      await saveAclFor(datasetWithAcl, cleanedAcl, { fetch: session.fetch });
      await deleteSolidDataset(datasetWithoutAclUrl, { fetch: session.fetch });
    });

    describe("Access Control Policies", () => {
      if (
        rootContainer.includes("inrupt.net") ||
        rootContainer.includes("pod-compat.inrupt.com")
      ) {
        // These servers do not support Access Control Policies,
        // so ACP tests can be skipped for them:
        return;
      }

      async function initialisePolicyResource(
        policyResourceUrl: UrlString,
        session: Session
      ) {
        let publicRule = acp.createRule(policyResourceUrl + "#rule-public");
        publicRule = acp.setPublic(publicRule, true);

        let publicReadPolicy = acp.createPolicy(
          policyResourceUrl + "#policy-publicRead"
        );
        publicReadPolicy = acp.addRequiredRuleUrl(publicReadPolicy, publicRule);
        publicReadPolicy = acp.setAllowModes(publicReadPolicy, {
          read: true,
          append: false,
          write: false,
        });

        let selfRule = acp.createRule(policyResourceUrl + "#rule-self");
        selfRule = acp.addAgent(selfRule, session.info.webId!);
        // This policy denies write access to the current user,
        // but allows write access so the Resource can still be removed afterwards:
        let selfWriteNoReadPolicy = acp.createPolicy(
          policyResourceUrl + "#policy-selfWriteNoRead"
        );
        selfWriteNoReadPolicy = acp.addRequiredRuleUrl(
          selfWriteNoReadPolicy,
          selfRule
        );
        selfWriteNoReadPolicy = acp.setAllowModes(selfWriteNoReadPolicy, {
          read: false,
          append: true,
          write: true,
        });
        selfWriteNoReadPolicy = acp.setDenyModes(selfWriteNoReadPolicy, {
          read: true,
          append: false,
          write: false,
        });

        let policyResource = createSolidDataset();
        policyResource = setThing(policyResource, publicRule);
        policyResource = setThing(policyResource, publicReadPolicy);
        policyResource = setThing(policyResource, selfRule);
        policyResource = setThing(policyResource, selfWriteNoReadPolicy);

        return saveSolidDatasetAt(policyResourceUrl, policyResource, {
          fetch: session.fetch,
        });
      }

      async function applyPolicyToPolicyResource(
        resourceUrl: UrlString,
        policyUrl: UrlString,
        session: Session
      ) {
        const resourceWithAcr = await acp.getSolidDatasetWithAcr(resourceUrl, {
          fetch: session.fetch,
        });
        if (!acp.hasAccessibleAcr(resourceWithAcr)) {
          throw new Error(
            `The test Resource at [${getSourceUrl(
              resourceWithAcr
            )}] does not appear to have a readable Access Control Resource. Please check the Pod setup.`
          );
        }
        const changedResourceWithAcr = acp.addPolicyUrl(
          resourceWithAcr,
          policyUrl
        );
        return acp.saveAcrFor(changedResourceWithAcr, {
          fetch: session.fetch,
        });
      }

      it("can deny Read access", async () => {
        const session = await getSession();
        const policyResourceUrl =
          rootContainer +
          `solid-client-tests/node/acp/policy-deny-agent-read-${session.info.sessionId}.ttl`;

        // Create a Resource containing Access Policies and Rules:
        await initialisePolicyResource(policyResourceUrl, session);

        // Verify that we can fetch the Resource before Denying Read access:
        await expect(
          getSolidDataset(policyResourceUrl, { fetch: session.fetch })
        ).resolves.not.toBeNull();

        // In the Resource's Access Control Resource, apply the Policy
        // that just so happens to be defined in the Resource itself,
        // and that denies Read access to the current user:
        await applyPolicyToPolicyResource(
          policyResourceUrl,
          policyResourceUrl + "#policy-selfWriteNoRead",
          session
        );

        // Verify that indeed, the current user can no longer read it:
        await expect(
          getSolidDataset(policyResourceUrl, { fetch: session.fetch })
        ).rejects.toThrow(
          // Forbidden:
          expect.objectContaining({ statusCode: 403 })
        );

        // Clean up:
        await deleteSolidDataset(policyResourceUrl, { fetch: session.fetch });
      });

      it("can allow public Read access", async () => {
        const session = await getSession();
        const policyResourceUrl =
          rootContainer +
          `solid-client-tests/node/acp/policy-allow-public-read-${session.info.sessionId}.ttl`;

        // Create a Resource containing Access Policies and Rules:
        await initialisePolicyResource(policyResourceUrl, session);

        // Verify that we cannot fetch the Resource before adding public Read access
        // when not logged in (i.e. not passing the session's fetch):
        await expect(getSolidDataset(policyResourceUrl)).rejects.toThrow(
          // Unauthorised:
          expect.objectContaining({ statusCode: 401 })
        );

        // In the Resource's Access Control Resource, apply the Policy
        // that just so happens to be defined in the Resource itself,
        // and provides Read access to the public:
        await applyPolicyToPolicyResource(
          policyResourceUrl,
          policyResourceUrl + "#policy-publicRead",
          session
        );

        // Verify that indeed, an unauthenticated user can now read it:
        await expect(
          getSolidDataset(policyResourceUrl)
        ).resolves.not.toBeNull();

        // Clean up:
        await deleteSolidDataset(policyResourceUrl, { fetch: session.fetch });
      });
    });
  }
);
