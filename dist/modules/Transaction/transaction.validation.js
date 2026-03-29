"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
const createTransactionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().min(0, 'Amount must be a positive number'),
        category: zod_1.z.enum(['mobile_banking', 'other']),
        type: zod_1.z.string().min(1, 'Type is required'),
        platformName: zod_1.z.string().optional(),
        actionName: zod_1.z.string().optional(),
        operator: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'success', 'failed']).optional(),
        referenceId: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        customProfit: zod_1.z.number().optional(),
    }),
});
exports.TransactionValidation = {
    createTransactionValidationSchema,
};
