"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceValidation = void 0;
const zod_1 = require("zod");
const createPlatformValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        platformName: zod_1.z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']),
        balance: zod_1.z.number().nonnegative().default(0),
    }),
});
const updateBalanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        balance: zod_1.z.number().nonnegative(),
    }),
});
const resetBalanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        platformName: zod_1.z.string(),
        balance: zod_1.z.number().nonnegative(),
    }),
});
exports.PlatformBalanceValidation = {
    createPlatformValidationSchema,
    updateBalanceValidationSchema,
    resetBalanceValidationSchema,
};
