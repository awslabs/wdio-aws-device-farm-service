// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const createTestGridUrlResponse = jest.fn().mockReturnValue(Promise.resolve({}));

const createTestGridUrlFn = jest.fn().mockImplementation(() => ({
  promise: createTestGridUrlResponse
}));

export default class DeviceFarm {
  createTestGridUrl = createTestGridUrlFn;
}
