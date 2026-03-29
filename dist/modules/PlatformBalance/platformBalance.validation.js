"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceValidation = void 0;
const zod_1 = require("zod");
const updateBalanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        balance: zod_1.z.number().min(0, 'Balance must be a positive number'),
    }),
});
const createPlatformValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        platformName: zod_1.z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet']),
        balance: zod_1.z.number().min(0, 'Balance must be a positive number').optional(),
    }),
});
const resetBalanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        platformName: zod_1.z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet']),
        balance: zod_1.z.number().min(0, 'Balance must be a positive number'),
    }),
});
exports.PlatformBalanceValidation = {
    updateBalanceValidationSchema,
    createPlatformValidationSchema,
    resetBalanceValidationSchema,
};
