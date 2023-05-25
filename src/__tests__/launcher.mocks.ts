// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { vi, Mock } from "vitest";

export const createTestGridUrlResponse = vi.fn();

export const CreateTestGridUrlCommand = vi.fn();

export const DeviceFarmClient: { prototype: { send: Mock } } = vi.fn();
DeviceFarmClient.prototype.send = createTestGridUrlResponse;
