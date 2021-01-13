// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path')
const { launcher } = require('../dist/index.js')

exports.config = {
    /**
     * specify test files
     */
    specs: [
        path.resolve(__dirname, 'devicefarm.test.js')
    ],

    /**
     * capabilities
     */
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true
    }],

    /**
     * test configurations
     */
    logLevel: 'trace',
    framework: 'mocha',
    outputDir: __dirname,

    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 30000
    },

    /**
     * device farm service configurations
     */
    services: [[launcher, {
        projectArn: process.env.PROJECT_ARN
    }]],
}
