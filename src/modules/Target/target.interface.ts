export type TTargetType = 'Sales' | 'Debt' | 'Profit' | 'Transactions';
export type TTargetPeriod = 'daily' | 'monthly' | 'yearly';

export type TTarget = {
  type: TTargetType;
  period: TTargetPeriod;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
};
