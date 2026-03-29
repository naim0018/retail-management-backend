import { z } from 'zod';

const updateBalanceValidationSchema = z.object({
  body: z.object({
    balance: z.number().min(0, 'Balance must be a positive number'),
  }),
});

const createPlatformValidationSchema = z.object({
  body: z.object({
    platformName: z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet']),
    balance: z.number().min(0, 'Balance must be a positive number').optional(),
  }),
});

const resetBalanceValidationSchema = z.object({
  body: z.object({
    platformName: z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet']),
    balance: z.number().min(0, 'Balance must be a positive number'),
  }),
});

export const PlatformBalanceValidation = {
  updateBalanceValidationSchema,
  createPlatformValidationSchema,
  resetBalanceValidationSchema,
};
