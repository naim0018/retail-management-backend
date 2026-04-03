import { Types } from 'mongoose';

export type TPlatformName = 'bKash' | 'bKash (P)' | 'bKash (M)' | 'Nagad' | 'Rocket' | 'Upay' | 'Tap' | 'mCash' | 'Main Wallet' | 'Flexiload';

export type TPlatformBalance = {
  userId: Types.ObjectId;
  platformName: TPlatformName;
  balance: number;
  lastUpdated: Date;
};
