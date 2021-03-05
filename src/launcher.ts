// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SevereServiceError } from "webdriverio";
import type { Services, Capabilities, Options } from "@wdio/types";
import DeviceFarm from "aws-sdk/clients/devicefarm";
import getLogger from "@wdio/logger";

const log = getLogger("@wdio/devicefarm-service");

interface DeviceFarmConfig {
  projectArn: string;
  expiresInSeconds?: number;
}

export default class DeviceFarmLauncher implements Services.ServiceInstance {
  private readonly devicefarm: DeviceFarm;
  readonly options: DeviceFarmConfig;

  constructor(options: DeviceFarmConfig) {
    // DeviceFarm is only available in us-west-2
    // https://docs.aws.amazon.com/general/latest/gr/devicefarm.html
    this.devicefarm = new DeviceFarm({ region: "us-west-2" });
    this.options = options;
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

    else {
      log.warn("DeviceFarm does not support multiremote mode")
    }
  }

  // https://docs.aws.amazon.com/devicefarm/latest/testgrid/testing-frameworks-nodejs.html
  private async createSession() {
    try {
      return await this.devicefarm
        .createTestGridUrl({
          projectArn: this.options.projectArn,
          expiresInSeconds: this.options.expiresInSeconds || 900,
        })
        .promise();
    } catch (err) {
      log.error(err);
      throw new SevereServiceError((err as Error).message);
    }
  }
}
