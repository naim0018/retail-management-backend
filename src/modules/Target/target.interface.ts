import { Types } from 'mongoose';

export type TTargetType = 'Sales' | 'Debt' | 'Profit' | 'Transactions';
export type TTargetPeriod = 'daily' | 'monthly' | 'yearly';

export type TTarget = {
  userId: Types.ObjectId;
  type: TTargetType;
  period: TTargetPeriod;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
};
