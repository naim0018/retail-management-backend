import { z } from 'zod';

const createTransactionValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    category: z.enum(['mobile_banking', 'other']),
    type: z.string(),
    platformName: z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']).optional(),
    actionName: z.string().optional(),
    operator: z.string().optional(),
    status: z.enum(['pending', 'success', 'failed']).optional(),
    customProfit: z.number().optional(),
    date: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
    referenceId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

const updateTransactionValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    category: z.enum(['mobile_banking', 'other']).optional(),
    type: z.string().optional(),
    platformName: z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']).optional(),
    actionName: z.string().optional(),
    operator: z.string().optional(),
    status: z.enum(['pending', 'success', 'failed']).optional(),
    customProfit: z.number().optional(),
    date: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    referenceId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const TransactionValidation = {
  createTransactionValidationSchema,
  updateTransactionValidationSchema,
};
