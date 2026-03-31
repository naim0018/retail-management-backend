import { Schema, model } from 'mongoose';
import { TPlatformBalance } from './platformBalance.interface';

const platformBalanceSchema = new Schema<TPlatformBalance>(
  {
    platformName: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload'],
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformBalance = model<TPlatformBalance>('PlatformBalance', platformBalanceSchema);
