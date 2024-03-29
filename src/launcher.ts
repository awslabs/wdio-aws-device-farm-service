// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  CreateTestGridUrlCommand,
  DeviceFarmClient,
} from "@aws-sdk/client-device-farm";
import type { Logger } from "@wdio/logger";
import type { Capabilities, Options, Services } from "@wdio/types";
import { SevereServiceError } from "webdriverio";

interface DeviceFarmConfig extends Services.ServiceOption {
  projectArn: string;
  expiresInSeconds?: number;
}

export default class DeviceFarmLauncher implements Services.ServiceInstance {
  private readonly devicefarmClient: DeviceFarmClient;
  private logger: Logger | undefined = undefined;

  constructor(private readonly _options: DeviceFarmConfig) {
    // DeviceFarm is only available in us-west-2
    // https://docs.aws.amazon.com/general/latest/gr/devicefarm.html
    this.devicefarmClient = new DeviceFarmClient({ region: "us-west-2" });
  }

  public async onPrepare(
    config: Options.Testrunner,
    capabilities: Capabilities.RemoteCapabilities
  ): Promise<void> {
    try {
      const getLogger = await import("@wdio/logger");
      this.logger = getLogger.default("@wdio/devicefarm-service");
    } catch {
      // No operation
    }
    if (Array.isArray(capabilities)) {
      for (const cap of capabilities) {
        await this.setRemoteSession(cap);
      }
    } else if (typeof capabilities === "object" && capabilities !== null) {
      for (const cap of Object.values(capabilities)) {
        await this.setRemoteSession(cap);
      }
    }
    // Set remote session so that wdio can skip setting up drivers for cross-browser tests.
    // See: https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-utils/src/node/manager.ts#L63
    await this.setRemoteSession(config);
  }

  private async setRemoteSession(
    config:
      | Capabilities.DesiredCapabilities
      | Capabilities.W3CCapabilities
      | Options.WebdriverIO
      | Options.Testrunner
  ) {
    const testGridUrlResult = await this.createSession();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = new URL(testGridUrlResult.url!);

    this.logger?.info("Created device farm test grid:", testGridUrlResult);

    Object.assign(config, {
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
      this.logger?.error(err);
      throw new SevereServiceError((err as Error).message);
    }
  }
}
