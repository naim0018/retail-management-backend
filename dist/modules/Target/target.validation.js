"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetValidation = void 0;
const zod_1 = require("zod");
const createTargetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['Sales', 'Debt', 'Profit', 'Transactions']),
        period: zod_1.z.enum(['daily', 'monthly', 'yearly']),
        targetAmount: zod_1.z.number().positive(),
        currentAmount: zod_1.z.number().nonnegative().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
const updateTargetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        targetAmount: zod_1.z.number().positive().optional(),
        currentAmount: zod_1.z.number().nonnegative().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
exports.TargetValidation = {
    createTargetValidationSchema,
    updateTargetValidationSchema,
};
