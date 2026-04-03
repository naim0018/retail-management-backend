import { Schema, model } from 'mongoose';
import { TTransaction } from './transaction.interface';

const transactionSchema = new Schema<TTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['mobile_banking', 'other'],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    platformName: {
      type: String,
      enum: ['bKash', 'bKash (P)', 'bKash (M)', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload'],
    },
    actionName: {
      type: String,
    },
    profit: {
      type: Number,
      default: 0,
    },
    customProfit: {
      type: Number,
    },
    operator: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'success',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    referenceId: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<TTransaction>('Transaction', transactionSchema);
