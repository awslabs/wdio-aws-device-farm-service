// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from "path";
import { launcher } from "../dist/index.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  /**
   * specify test files
   */
  specs: [path.resolve(__dirname, "devicefarm.test.js")],

  /**
   * capabilities
   */
  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,
    },
  ],

  /**
   * test configurations
   */
  logLevel: "trace",
  framework: "mocha",
  outputDir: __dirname,

  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 30000,
  },

  /**
   * device farm service configurations
   */
  services: [
    [
      launcher,
      {
        projectArn: process.env.PROJECT_ARN,
      },
    ],
  ],
};
