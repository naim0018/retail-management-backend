import { z } from 'zod';

const createTargetValidationSchema = z.object({
  body: z.object({
    type: z.enum(['Sales', 'Debt', 'Profit', 'Transactions']),
    period: z.enum(['daily', 'monthly', 'yearly']),
    targetAmount: z.number().positive(),
    currentAmount: z.number().nonnegative().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const updateTargetValidationSchema = z.object({
  body: z.object({
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().nonnegative().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const TargetValidation = {
  createTargetValidationSchema,
  updateTargetValidationSchema,
};
