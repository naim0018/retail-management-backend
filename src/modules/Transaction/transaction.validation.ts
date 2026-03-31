import { z } from 'zod';

const createTransactionValidationSchema = z.object({
  body: z.object({
    amount: z.number().min(0, 'Amount must be a positive number'),
    category: z.enum(['mobile_banking', 'other']),
    type: z.string().min(1, 'Type is required'),
    platformName: z.string().optional(),
    actionName: z.string().optional(),
    operator: z.string().optional(),
    status: z.enum(['pending', 'success', 'failed']).optional(),
    referenceId: z.string().optional(),
    notes: z.string().optional(),
    customProfit: z.number().optional(),
  }),
});

const updateTransactionValidationSchema = z.object({
  body: z.object({
    amount: z.number().min(0).optional(),
    category: z.enum(['mobile_banking', 'other']).optional(),
    type: z.string().optional(),
    platformName: z.string().optional(),
    actionName: z.string().optional(),
    operator: z.string().optional(),
    status: z.enum(['pending', 'success', 'failed']).optional(),
    referenceId: z.string().optional(),
    notes: z.string().optional(),
    customProfit: z.number().optional(),
  }),
});

export const TransactionValidation = {
  createTransactionValidationSchema,
  updateTransactionValidationSchema,
};
