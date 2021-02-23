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

import { jest, describe, it, expect } from "@jest/globals";
import { addMockAcrTo, mockAcrFor } from "../acp/mock";
import { mockSolidDatasetFrom } from "../resource/mock";
import {
  Access,
  getAgentAccess,
  getAgentAccessAll,
  getGroupAccess,
  getGroupAccessAll,
  getPublicAccess,
  setAgentAccess,
  setGroupAccess,
  setPublicAccess,
  getAccessFor as reexport_getAccessFor,
} from "./universal";
import * as acpLowLevel from "../acp/acp";
import * as acpModule from "./acp";
import * as wacModule from "./wac";
import { addMockResourceAclTo } from "../acl/mock";
import { getAccessFor } from "./accessFor";

jest.mock("../fetcher");

describe("getAgentAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_getAgentAccess");

    await getAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me"
    );

    expect(acpModule.internal_getAgentAccess).toHaveBeenCalledTimes(1);
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetAgentAccess = jest.spyOn(wacModule, "getAgentAccess");
    wacGetAgentAccess.mockResolvedValue(null);

    await getAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me"
    );

    expect(wacGetAgentAccess).toHaveBeenCalledTimes(1);
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAgentAccess(
      "https://some.pod/resource",
      "https://arbitrary.pod/profile#me",
      options
    );

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetAgentAccess = jest.spyOn(wacModule, "getAgentAccess");
    wacGetAgentAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await getAgentAccess(
      "https://arbitrary.pod/resource",
      "https://some.pod/profile#me",
      options
    );

    expect(wacGetAgentAccess).toHaveBeenCalledWith(
      expect.anything(),
      "https://some.pod/profile#me",
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await getAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me"
    );

    expect(access).toBeNull();
  });
});

describe("setAgentAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setAgentAccess");

    await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(acpModule.internal_setAgentAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for ACP-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpModule, "internal_setAgentAccess")
      .mockReturnValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpLowLevel, "saveAcrFor")
      .mockResolvedValueOnce(undefined as any);
    jest.spyOn(acpModule, "internal_getAgentAccess").mockReturnValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetAgentAccess = jest.spyOn(wacModule, "setAgentResourceAccess");
    wacSetAgentAccess.mockResolvedValue(null);

    await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(wacSetAgentAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for WAC-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetAgentAccess = jest.spyOn(wacModule, "setAgentResourceAccess");
    wacSetAgentAccess.mockResolvedValue(null);
    jest.spyOn(wacModule, "getAgentAccess").mockResolvedValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });

  it("throws an error when setting differing controlRead and controlWrite for a WAC-controlled Resource", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom("https://some.pod/resource");
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetAgentAccess = jest.spyOn(wacModule, "setAgentResourceAccess");
    wacSetAgentAccess.mockResolvedValue(null);

    await expect(
      setAgentAccess(
        "https://some.pod/resource",
        "https://arbitrary.pod/profile#me",
        { controlRead: true, controlWrite: undefined }
      )
    ).rejects.toThrow(
      "When setting access for a Resource in a Pod implementing Web Access Control (i.e. [https://some.pod/resource]), `controlRead` and `controlWrite` should have the same value."
    );
  });

  it("returns null when the ACP module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setAgentAccess").mockReturnValueOnce(null);

    const returnValue = await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(returnValue).toBeNull();
  });

  it("returns null when the WAC module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetAgentAccess = jest.spyOn(wacModule, "setAgentResourceAccess");
    wacSetAgentAccess.mockResolvedValue(null);

    const returnedAccess = await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(returnedAccess).toBeNull();
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setAgentAccess(
      "https://some.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true },
      options
    );

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetAgentAccess = jest.spyOn(wacModule, "setAgentResourceAccess");
    wacSetAgentAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://some.pod/profile#me",
      { read: true },
      options
    );

    expect(wacSetAgentAccess).toHaveBeenCalledWith(
      expect.anything(),
      "https://some.pod/profile#me",
      { read: true },
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await setAgentAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/profile#me",
      { read: true }
    );

    expect(access).toBeNull();
  });
});

describe("getGroupAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_getGroupAccess");

    await getGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group"
    );

    expect(acpModule.internal_getGroupAccess).toHaveBeenCalledTimes(1);
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetGroupAccess = jest.spyOn(wacModule, "getGroupAccess");
    wacGetGroupAccess.mockResolvedValue(null);

    await getGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group"
    );

    expect(wacGetGroupAccess).toHaveBeenCalledTimes(1);
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroupAccess(
      "https://some.pod/resource",
      "https://arbitrary.pod/groups#group",
      options
    );

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetGroupAccess = jest.spyOn(wacModule, "getGroupAccess");
    wacGetGroupAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await getGroupAccess(
      "https://arbitrary.pod/resource",
      "https://some.pod/groups#group",
      options
    );

    expect(wacGetGroupAccess).toHaveBeenCalledWith(
      expect.anything(),
      "https://some.pod/groups#group",
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await getGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group"
    );

    expect(access).toBeNull();
  });
});

describe("setGroupAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setGroupAccess");

    await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(acpModule.internal_setGroupAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for ACP-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpModule, "internal_setGroupAccess")
      .mockReturnValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpLowLevel, "saveAcrFor")
      .mockResolvedValueOnce(undefined as any);
    jest.spyOn(acpModule, "internal_getGroupAccess").mockReturnValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetGroupAccess = jest.spyOn(wacModule, "setGroupResourceAccess");
    wacSetGroupAccess.mockResolvedValue(null);

    await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(wacSetGroupAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for WAC-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetGroupAccess = jest.spyOn(wacModule, "setGroupResourceAccess");
    wacSetGroupAccess.mockResolvedValue(null);
    jest.spyOn(wacModule, "getGroupAccess").mockResolvedValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });
  it("throws an error when setting differing controlRead and controlWrite for a WAC-controlled Resource", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom("https://some.pod/resource");
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetGroupAccess = jest.spyOn(wacModule, "setGroupResourceAccess");
    wacSetGroupAccess.mockResolvedValue(null);

    await expect(
      setGroupAccess(
        "https://some.pod/resource",
        "https://arbitrary.pod/groups#group",
        { controlRead: true, controlWrite: undefined }
      )
    ).rejects.toThrow(
      "When setting access for a Resource in a Pod implementing Web Access Control (i.e. [https://some.pod/resource]), `controlRead` and `controlWrite` should have the same value."
    );
  });

  it("returns null when the ACP module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setGroupAccess").mockReturnValueOnce(null);

    const returnValue = await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(returnValue).toBeNull();
  });

  it("returns null when the WAC module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetGroupAccess = jest.spyOn(wacModule, "setGroupResourceAccess");
    wacSetGroupAccess.mockResolvedValue(null);

    const returnedAccess = await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(returnedAccess).toBeNull();
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setGroupAccess(
      "https://some.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true },
      options
    );

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetGroupAccess = jest.spyOn(wacModule, "setGroupResourceAccess");
    wacSetGroupAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://some.pod/groups#group",
      { read: true },
      options
    );

    expect(wacSetGroupAccess).toHaveBeenCalledWith(
      expect.anything(),
      "https://some.pod/groups#group",
      { read: true },
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await setGroupAccess(
      "https://arbitrary.pod/resource",
      "https://arbitrary.pod/groups#group",
      { read: true }
    );

    expect(access).toBeNull();
  });
});

describe("getPublicAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_getPublicAccess");

    await getPublicAccess("https://arbitrary.pod/resource");

    expect(acpModule.internal_getPublicAccess).toHaveBeenCalledTimes(1);
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetPublicAccess = jest.spyOn(wacModule, "getPublicAccess");
    wacGetPublicAccess.mockResolvedValue(null);

    await getPublicAccess("https://arbitrary.pod/resource");

    expect(wacGetPublicAccess).toHaveBeenCalledTimes(1);
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getPublicAccess("https://some.pod/resource", options);

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetPublicAccess = jest.spyOn(wacModule, "getPublicAccess");
    wacGetPublicAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await getPublicAccess("https://arbitrary.pod/resource", options);

    expect(wacGetPublicAccess).toHaveBeenCalledWith(expect.anything(), options);
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await getPublicAccess("https://arbitrary.pod/resource");

    expect(access).toBeNull();
  });
});

describe("setPublicAccess", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setPublicAccess");

    await setPublicAccess("https://arbitrary.pod/resource", { read: true });

    expect(acpModule.internal_setPublicAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for ACP-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpModule, "internal_setPublicAccess")
      .mockReturnValueOnce(mockedResourceWithAcr);
    jest
      .spyOn(acpLowLevel, "saveAcrFor")
      .mockResolvedValueOnce(undefined as any);
    jest.spyOn(acpModule, "internal_getPublicAccess").mockReturnValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setPublicAccess(
      "https://arbitrary.pod/resource",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetPublicAccess = jest.spyOn(wacModule, "setPublicResourceAccess");
    wacSetPublicAccess.mockResolvedValue(null);

    await setPublicAccess("https://arbitrary.pod/resource", { read: true });

    expect(wacSetPublicAccess).toHaveBeenCalledTimes(1);
  });

  it("returns the new effective access for WAC-controlled Resources", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetPublicAccess = jest.spyOn(wacModule, "setPublicResourceAccess");
    wacSetPublicAccess.mockResolvedValue(null);
    jest.spyOn(wacModule, "getPublicAccess").mockResolvedValueOnce({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });

    const returnedAccess = await setPublicAccess(
      "https://arbitrary.pod/resource",
      { read: true }
    );

    expect(returnedAccess).toStrictEqual({
      read: false,
      append: true,
      write: false,
      controlRead: false,
      controlWrite: false,
    });
  });
  it("throws an error when setting differing controlRead and controlWrite for a WAC-controlled Resource", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom("https://some.pod/resource");
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetPublicAccess = jest.spyOn(wacModule, "setPublicResourceAccess");
    wacSetPublicAccess.mockResolvedValue(null);

    await expect(
      setPublicAccess("https://some.pod/resource", {
        controlRead: true,
        controlWrite: undefined,
      })
    ).rejects.toThrow(
      "When setting access for a Resource in a Pod implementing Web Access Control (i.e. [https://some.pod/resource]), `controlRead` and `controlWrite` should have the same value."
    );
  });

  it("returns null when the ACP module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_setPublicAccess").mockReturnValueOnce(null);

    const returnValue = await setPublicAccess(
      "https://arbitrary.pod/resource",
      { read: true }
    );

    expect(returnValue).toBeNull();
  });

  it("returns null when the WAC module could not update the ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetPublicAccess = jest.spyOn(wacModule, "setPublicResourceAccess");
    wacSetPublicAccess.mockResolvedValue(null);

    const returnedAccess = await setPublicAccess(
      "https://arbitrary.pod/resource",
      { read: true }
    );

    expect(returnedAccess).toBeNull();
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setPublicAccess("https://some.pod/resource", { read: true }, options);

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacSetPublicAccess = jest.spyOn(wacModule, "setPublicResourceAccess");
    wacSetPublicAccess.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await setPublicAccess(
      "https://arbitrary.pod/resource",
      { read: true },
      options
    );

    expect(wacSetPublicAccess).toHaveBeenCalledWith(
      expect.anything(),
      { read: true },
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await setPublicAccess("https://arbitrary.pod/resource", {
      read: true,
    });

    expect(access).toBeNull();
  });
});

describe("getAgentAccessAll", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_getAgentAccessAll");

    await getAgentAccessAll("https://arbitrary.pod/resource");

    expect(acpModule.internal_getAgentAccessAll).toHaveBeenCalledTimes(1);
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetAgentAccessAll = jest.spyOn(wacModule, "getAgentAccessAll");
    wacGetAgentAccessAll.mockResolvedValue(null);

    await getAgentAccessAll("https://arbitrary.pod/resource");

    expect(wacGetAgentAccessAll).toHaveBeenCalledTimes(1);
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAgentAccessAll("https://some.pod/resource", options);

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetAgentAccessAll = jest.spyOn(wacModule, "getAgentAccessAll");
    wacGetAgentAccessAll.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await getAgentAccessAll("https://arbitrary.pod/resource", options);

    expect(wacGetAgentAccessAll).toHaveBeenCalledWith(
      expect.anything(),
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await getAgentAccessAll("https://arbitrary.pod/resource");

    expect(access).toBeNull();
  });
});

describe("getGroupAccessAll", () => {
  it("calls out to the well-tested ACP API for Resources with an ACR", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedAcr = mockAcrFor("https://arbitrary.pod/resource");
    const mockedResourceWithAcr = addMockAcrTo(mockedResource, mockedAcr);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcr);
    jest.spyOn(acpModule, "internal_getGroupAccessAll");

    await getGroupAccessAll("https://arbitrary.pod/resource");

    expect(acpModule.internal_getGroupAccessAll).toHaveBeenCalledTimes(1);
  });

  it("calls out to the well-tested WAC API for Resources with an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetGroupAccessAll = jest.spyOn(wacModule, "getGroupAccessAll");
    wacGetGroupAccessAll.mockResolvedValue(null);

    await getGroupAccessAll("https://arbitrary.pod/resource");

    expect(wacGetGroupAccessAll).toHaveBeenCalledTimes(1);
  });

  it("uses the provided fetch function", () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const options = { fetch: () => new Promise(jest.fn()) as any };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroupAccessAll("https://some.pod/resource", options);

    expect(getResourceInfoWithAcr).toHaveBeenCalledWith(
      "https://some.pod/resource",
      options
    );
  });

  it("passes the provided fetch function to the WAC module", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    const mockedResourceWithAcl = addMockResourceAclTo(mockedResource);
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResourceWithAcl as any);
    const wacGetGroupAccessAll = jest.spyOn(wacModule, "getGroupAccessAll");
    wacGetGroupAccessAll.mockResolvedValue(null);
    const options = { fetch: () => new Promise(jest.fn()) as any };

    await getGroupAccessAll("https://arbitrary.pod/resource", options);

    expect(wacGetGroupAccessAll).toHaveBeenCalledWith(
      expect.anything(),
      options
    );
  });

  it("returns null if the Resource has neither an ACR nor an ACL", async () => {
    const getResourceInfoWithAcr = jest.spyOn(
      acpLowLevel,
      "getResourceInfoWithAcr"
    );
    const mockedResource = mockSolidDatasetFrom(
      "https://arbitrary.pod/resource"
    );
    getResourceInfoWithAcr.mockResolvedValueOnce(mockedResource as any);

    const access = await getGroupAccessAll("https://arbitrary.pod/resource");

    expect(access).toBeNull();
  });
});

describe("getAccessFor", () => {
  it("calls to getAgentAccess with the appropriate parameters", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getAgentAccess: () => Promise<Access | null>;
    };
    universalModule.getAgentAccess = jest.fn();
    const options = {
      fetch: jest.fn().mockResolvedValue({
        ok: false,
      } as never) as typeof fetch,
    };
    await getAccessFor("https://some.resource", "agent", {
      actor: "https://some.pod/profile#webid",
      ...options,
    });
    expect(universalModule.getAgentAccess).toHaveBeenCalledWith(
      "https://some.resource",
      "https://some.pod/profile#webid",
      expect.objectContaining(options)
    );
  });

  it("throws if the agent has been omited", async () => {
    const options = {
      fetch: jest.fn() as typeof fetch,
    };
    await expect(
      getAccessFor(
        "https://some.resource",
        ("agent" as unknown) as "public",
        options
      )
    ).rejects.toThrow(
      "When reading Agent-specific access, the given agent cannot be left undefined."
    );
  });

  it("calls to getGroupAccess with the appropriate parameters", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getGroupAccess: () => Promise<Access | null>;
    };
    universalModule.getGroupAccess = jest.fn();
    const options = {
      fetch: jest.fn() as typeof fetch,
    };
    await getAccessFor("https://some.resource", "group", {
      actor: "https://some.pod/groups#group",
      ...options,
    });
    expect(universalModule.getGroupAccess).toHaveBeenCalledWith(
      "https://some.resource",
      "https://some.pod/groups#group",
      expect.objectContaining(options)
    );
  });

  it("throws if the group has been omited", async () => {
    await expect(
      getAccessFor("https://some.resource", ("group" as unknown) as "public")
    ).rejects.toThrow(
      "When reading Group-specific access, the given group cannot be left undefined."
    );
  });

  it("throws if an actor is specified for public", async () => {
    await expect(
      getAccessFor("https://some.resource", "public", ({
        actor: "some actor",
      } as unknown) as { fetch: typeof fetch })
    ).rejects.toThrow(
      "When reading public access, no actor type should be specified (here [some actor])."
    );
  });

  it("calls to getPublicAccess with the appropriate parameters", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getPublicAccess: () => Promise<Access | null>;
    };
    universalModule.getPublicAccess = jest.fn();

    const options = {
      fetch: jest.fn() as typeof fetch,
    };
    await getAccessFor("https://some.resource", "public", options);
    expect(universalModule.getPublicAccess).toHaveBeenCalledWith(
      "https://some.resource",
      options
    );
  });

  it("defaults to the included fetcher for agents", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getAgentAccess: () => Promise<Access | null>;
    };
    const fetcher = jest.requireMock("../fetcher") as {
      fetch: typeof fetch;
    };
    // Make it so that we can check the mocked fetcher has been passed
    fetcher.fetch = ("mock" as unknown) as typeof fetch;
    universalModule.getAgentAccess = jest.fn();
    await getAccessFor("https://some.resource", "agent", {
      actor: "https://some.pod/profile#agent",
    });
    expect(
      universalModule.getAgentAccess
    ).toHaveBeenCalledWith(
      "https://some.resource",
      "https://some.pod/profile#agent",
      { fetch: "mock" }
    );
  });

  it("defaults to the included fetcher for groups", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getGroupAccess: () => Promise<Access | null>;
    };
    const fetcher = jest.requireMock("../fetcher") as {
      fetch: typeof fetch;
    };
    // Make it so that we can check the mocked fetcher has been passed
    fetcher.fetch = ("mock" as unknown) as typeof fetch;
    universalModule.getGroupAccess = jest.fn();
    await getAccessFor("https://some.resource", "group", {
      actor: "https://some.pod/groups#group",
    });
    expect(
      universalModule.getGroupAccess
    ).toHaveBeenCalledWith(
      "https://some.resource",
      "https://some.pod/groups#group",
      { fetch: "mock" }
    );
  });

  it("defaults to the included fetcher for public", async () => {
    const universalModule = jest.requireActual("./universal") as {
      getPublicAccess: () => Promise<Access | null>;
    };
    const fetcher = jest.requireMock("../fetcher") as {
      fetch: typeof fetch;
    };
    // Make it so that we can check the mocked fetcher has been passed
    fetcher.fetch = ("mock" as unknown) as typeof fetch;
    universalModule.getPublicAccess = jest.fn();
    // This is an edge case that should not happen "in the wild"
    await getAccessFor("https://some.resource", "public", ({
      actor: undefined,
    } as unknown) as { fetch: typeof fetch });
    expect(
      universalModule.getPublicAccess
    ).toHaveBeenCalledWith("https://some.resource", { fetch: "mock" });
  });

  it("returns null if an unknown actor type is given", async () => {
    await expect(
      getAccessFor(
        "https://some.resource",
        ("unknown-actor" as unknown) as "public"
      )
    ).resolves.toBeNull();
  });

  it("re-exports getAccessFrom", () => {
    expect(reexport_getAccessFor).toBeDefined();
  });
});
