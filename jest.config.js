// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**",
    "!**/__tests__/**"
  ],
  coverageReporters: [
    "html",
    "json",
    "lcov"
  ],
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['example', 'dist']
};
