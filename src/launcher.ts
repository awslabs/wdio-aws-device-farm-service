// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SevereServiceError } from "webdriverio";
import DeviceFarm from "aws-sdk/clients/devicefarm";
import getLogger from "@wdio/logger";
import { Services, Capabilities, Options } from "@wdio/types";

const log = getLogger("@wdio/devicefarm-service");

interface DeviceFarmConfig extends Services.ServiceOption {
  projectArn: string;
  expiresInSeconds?: number;
}

export default class DeviceFarmLauncher implements Services.ServiceInstance {
  private readonly devicefarm: DeviceFarm;

  constructor(private readonly _options: DeviceFarmConfig) {
    // DeviceFarm is only available in us-west-2
    // https://docs.aws.amazon.com/general/latest/gr/devicefarm.html
    this.devicefarm = new DeviceFarm({ region: "us-west-2" });
  }

  public async onPrepare(
    _config: Options.Testrunner,
    capabilities: Capabilities.RemoteCapabilities
  ): Promise<void> {
    if (Array.isArray(capabilities)) {
      for (const cap of capabilities) {
        const testGridUrlResult = await this.createSession();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const url = new URL(testGridUrlResult.url!);

        log.info("Created device farm test grid:", testGridUrlResult);

        Object.assign(cap, {
          protocol: "https",
          port: 443,
          hostname: url.hostname,
          path: url.pathname,
          connectionRetryTimeout: 180000,
        });
      }
    }
  }

  // https://docs.aws.amazon.com/devicefarm/latest/testgrid/testing-frameworks-nodejs.html
  private async createSession() {
    try {
      return await this.devicefarm
        .createTestGridUrl({
          projectArn: this._options.projectArn,
          expiresInSeconds: this._options.expiresInSeconds || 900,
        })
        .promise();
    } catch (err) {
      log.error(err);
      throw new SevereServiceError((err as Error).message);
    }
  }
}
