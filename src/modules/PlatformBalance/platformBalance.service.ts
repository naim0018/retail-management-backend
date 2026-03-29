import mongoose from 'mongoose';
import { TPlatformBalance } from './platformBalance.interface';
import { PlatformBalance } from './platformBalance.model';
import { Transaction } from '../Transaction/transaction.model';

const initializePlatformBalanceIntoDB = async (payload: TPlatformBalance) => {
  const result = await PlatformBalance.create(payload);
  return result;
};

const getAllPlatformBalancesFromDB = async () => {
  const result = await PlatformBalance.find();
  return result;
};

const updatePlatformBalanceInDB = async (id: string, balance: number) => {
  const result = await PlatformBalance.findByIdAndUpdate(
    id,
    { balance, lastUpdated: new Date() },
    { new: true }
  );
  return result;
};

const resetPlatformBalanceByName = async (platformName: string, balance: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Update/Reset Platform Balance
    const updatedBalance = await PlatformBalance.findOneAndUpdate(
      { platformName },
      { balance, lastUpdated: new Date() },
      { new: true, upsert: true, session }
    );

    // 2. Create a "Balance Reset" transaction record for history
    await Transaction.create([
      {
        amount: balance,
        category: 'other',
        type: 'Balance Reset',
        platformName: platformName as any,
        actionName: platformName,
        status: 'success',
        profit: 0,
        notes: `Manual balance reset to ৳${balance}`,
      }
    ], { session });

    await session.commitTransaction();
    await session.endSession();
    return updatedBalance;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const resetAllBalancesFromDB = async () => {
  const result = await PlatformBalance.updateMany({}, { balance: 0, lastUpdated: new Date() });
  return result;
};

export const PlatformBalanceServices = {
  initializePlatformBalanceIntoDB,
  getAllPlatformBalancesFromDB,
  updatePlatformBalanceInDB,
  resetPlatformBalanceByName,
  resetAllBalancesFromDB,
};
