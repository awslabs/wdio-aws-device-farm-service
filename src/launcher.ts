// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SevereServiceError } from "webdriverio";
import {
  DeviceFarmClient,
  CreateTestGridUrlCommand,
} from "@aws-sdk/client-device-farm";
import getLogger from "@wdio/logger";
import { Services, Capabilities, Options } from "@wdio/types";

const log = getLogger("@wdio/devicefarm-service");

interface DeviceFarmConfig extends Services.ServiceOption {
  projectArn: string;
  expiresInSeconds?: number;
}

export default class DeviceFarmLauncher implements Services.ServiceInstance {
  private readonly devicefarmClient: DeviceFarmClient;

  constructor(private readonly _options: DeviceFarmConfig) {
    // DeviceFarm is only available in us-west-2
    // https://docs.aws.amazon.com/general/latest/gr/devicefarm.html
    this.devicefarmClient = new DeviceFarmClient({ region: "us-west-2" });
  }

  public async onPrepare(
    _config: Options.Testrunner,
    capabilities: Capabilities.RemoteCapabilities
  ): Promise<void> {
    if (Array.isArray(capabilities)) {
      for (const cap of capabilities) {
        await this.setCapabilitySession(cap);
      }
    } else if (typeof capabilities === "object" && capabilities !== null) {
      for (const cap of Object.values(capabilities)) {
        await this.setCapabilitySession(cap);
      }
    }
  }

  private async setCapabilitySession(
    capability:
      | Capabilities.DesiredCapabilities
      | Capabilities.W3CCapabilities
      | Options.WebdriverIO
  ) {
    const testGridUrlResult = await this.createSession();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = new URL(testGridUrlResult.url!);

    log.info("Created device farm test grid:", testGridUrlResult);

    Object.assign(capability, {
      protocol: "https",
      port: 443,
      hostname: url.hostname,
      path: url.pathname,
      connectionRetryTimeout: 180000,
    });
  }

  // https://docs.aws.amazon.com/devicefarm/latest/testgrid/testing-frameworks-nodejs.html
  private async createSession() {
    const input = {
      projectArn: this._options.projectArn,
      expiresInSeconds: this._options.expiresInSeconds || 900,
    };
    const command = new CreateTestGridUrlCommand(input);
    try {
      return await this.devicefarmClient.send(command);
    } catch (err) {
      log.error(err);
      throw new SevereServiceError((err as Error).message);
    }
  }
}
