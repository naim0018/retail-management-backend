import { Types } from 'mongoose';

export type TPlatformName = 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Tap' | 'mCash' | 'Main Wallet' | 'Flexiload';

export type TPlatformBalance = {
  userId: Types.ObjectId;
  platformName: TPlatformName;
  balance: number;
  lastUpdated: Date;
};
