import { z } from 'zod';

const createTargetValidationSchema = z.object({
  body: z.object({
    type: z.enum(['Sales', 'Debt', 'Profit', 'Transactions']),
    period: z.enum(['daily', 'monthly', 'yearly']),
    targetAmount: z.number().min(0, 'Target amount must be a positive number'),
    currentAmount: z.number().min(0).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

const updateTargetValidationSchema = z.object({
  body: z.object({
    currentAmount: z.number().min(0).optional(),
    targetAmount: z.number().min(0).optional(),
  }),
});

export const TargetValidation = {
  createTargetValidationSchema,
  updateTargetValidationSchema,
};
