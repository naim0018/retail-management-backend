import { Schema, model } from 'mongoose';
import { TPlatformBalance } from './platformBalance.interface';

const platformBalanceSchema = new Schema<TPlatformBalance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platformName: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload'],
      required: true,
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

platformBalanceSchema.index({ userId: 1, platformName: 1 }, { unique: true });

export const PlatformBalance = model<TPlatformBalance>('PlatformBalance', platformBalanceSchema);
