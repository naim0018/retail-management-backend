import { z } from 'zod';

const createPlatformValidationSchema = z.object({
  body: z.object({
    platformName: z.enum(['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload']),
    balance: z.number().nonnegative().default(0),
  }),
});

const updateBalanceValidationSchema = z.object({
  body: z.object({
    balance: z.number().nonnegative(),
  }),
});

const resetBalanceValidationSchema = z.object({
  body: z.object({
    platformName: z.string(),
    balance: z.number().nonnegative(),
  }),
});

export const PlatformBalanceValidation = {
  createPlatformValidationSchema,
  updateBalanceValidationSchema,
  resetBalanceValidationSchema,
};
