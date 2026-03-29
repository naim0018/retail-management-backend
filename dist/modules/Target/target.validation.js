"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetValidation = void 0;
const zod_1 = require("zod");
const createTargetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['Sales', 'Debt', 'Profit', 'Transactions']),
        period: zod_1.z.enum(['daily', 'monthly', 'yearly']),
        targetAmount: zod_1.z.number().min(0, 'Target amount must be a positive number'),
        currentAmount: zod_1.z.number().min(0).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
const updateTargetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentAmount: zod_1.z.number().min(0).optional(),
        targetAmount: zod_1.z.number().min(0).optional(),
    }),
});
exports.TargetValidation = {
    createTargetValidationSchema,
    updateTargetValidationSchema,
};
