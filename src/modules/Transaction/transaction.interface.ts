import { Schema, Types } from 'mongoose';
import { TPlatformName } from '../PlatformBalance/platformBalance.interface';

export type TTransactionCategory = 'mobile_banking' | 'other';
export type TTransactionStatus = 'pending' | 'success' | 'failed';

export type TTransaction = {
  userId: Types.ObjectId;
  amount: number;
  category: TTransactionCategory;
  type: string; // e.g., 'Cash In', 'Photocopy', 'Flexiload'
  platformName?: TPlatformName; // e.g., 'bKash', 'Nagad'
  actionName?: string; // e.g., 'bKash', 'Flexiload', 'Customer Service'
  operator?: string; // e.g., 'Grameenphone', required if action is flexiload
  status: TTransactionStatus;
  profit?: number;
  customProfit?: number; // Optional override — if provided, skips backend profit calculation
  date: Date;
  referenceId?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
