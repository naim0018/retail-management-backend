"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
const createTransactionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive(),
        category: zod_1.z.enum(['mobile_banking', 'other']),
        type: zod_1.z.string(),
        platformName: zod_1.z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']).optional(),
        actionName: zod_1.z.string().optional(),
        operator: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'success', 'failed']).optional(),
        customProfit: zod_1.z.number().optional(),
        date: zod_1.z.string().optional().transform((val) => val ? new Date(val) : new Date()),
        referenceId: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
const updateTransactionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive().optional(),
        category: zod_1.z.enum(['mobile_banking', 'other']).optional(),
        type: zod_1.z.string().optional(),
        platformName: zod_1.z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']).optional(),
        actionName: zod_1.z.string().optional(),
        operator: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'success', 'failed']).optional(),
        customProfit: zod_1.z.number().optional(),
        date: zod_1.z.string().optional().transform((val) => val ? new Date(val) : undefined),
        referenceId: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.TransactionValidation = {
    createTransactionValidationSchema,
    updateTransactionValidationSchema,
};
