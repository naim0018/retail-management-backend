import { Schema, model } from 'mongoose';
import { TTarget } from './target.interface';

const targetSchema = new Schema<TTarget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Sales', 'Debt', 'Profit', 'Transactions'],
      required: true,
    },
    period: {
      type: String,
      enum: ['daily', 'monthly', 'yearly'],
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Target = model<TTarget>('Target', targetSchema);
