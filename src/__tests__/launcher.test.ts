// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createTestGridUrlResponse } from "../__mocks__/aws-sdk/clients/devicefarm";
import { SevereServiceError } from "webdriverio";
import DeviceFarmLauncher from "../launcher";

describe("DeviceFarmLauncher", () => {
  it("Updates capabilities with destination", async () => {
    createTestGridUrlResponse.mockReturnValueOnce({ url: "https://devicefarm.url/id" })

    const projectArn = "arn";
    const subject = new DeviceFarmLauncher({ projectArn });

    const capabilites = { browserName: "chrome" };
    await subject.onPrepare({}, [capabilites]);

    expect(capabilites).toEqual({
      protocol: "https",
      hostname: "devicefarm.url",
      path: "/id",
      port: 443,
      browserName: "chrome",
      connectionRetryTimeout: 180000,
    });
  });

  it("Throws ServereServiceError when create test grid url fails", () => {
    const errorMessage = "Failed";
    createTestGridUrlResponse.mockImplementationOnce(() => {
      throw new Error(errorMessage)
    });

    const projectArn = "arn";
    const subject = new DeviceFarmLauncher({ projectArn });

    const capabilites = { browserName: "chrome" };
    void expect(subject.onPrepare({}, [capabilites])).rejects.toEqual(
      new SevereServiceError(errorMessage)
    );
  });
});
