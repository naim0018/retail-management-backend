import mongoose, { Types } from 'mongoose';
import { TPlatformBalance } from './platformBalance.interface';
import { PlatformBalance } from './platformBalance.model';
import { Transaction } from '../Transaction/transaction.model';

const initializePlatformBalanceIntoDB = async (userId: string | Types.ObjectId, payload: TPlatformBalance) => {
  payload.userId = new Types.ObjectId(userId);
  const result = await PlatformBalance.create(payload);
  return result;
};

const getAllPlatformBalancesFromDB = async (userId: string | Types.ObjectId) => {
  const result = await PlatformBalance.find({ userId });
  return result;
};

const updatePlatformBalanceInDB = async (userId: string | Types.ObjectId, id: string, balance: number) => {
  const result = await PlatformBalance.findOneAndUpdate(
    { _id: id, userId },
    { balance, lastUpdated: new Date() },
    { new: true }
  );
  return result;
};

const resetPlatformBalanceByName = async (userId: string | Types.ObjectId, platformName: string, balance: number) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const uId = new Types.ObjectId(userId);

    // 1. Update/Reset Platform Balance
    const updatedBalance = await PlatformBalance.findOneAndUpdate(
      { userId: uId, platformName },
      { balance, lastUpdated: new Date() },
      { new: true, upsert: true, session }
    );

    // 2. Create a "Balance Reset" transaction record for history
    await Transaction.create([
      {
        userId: uId,
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

const resetAllBalancesFromDB = async (userId: string | Types.ObjectId) => {
  const result = await PlatformBalance.updateMany({ userId }, { balance: 0, lastUpdated: new Date() });
  return result;
};

export const PlatformBalanceServices = {
  initializePlatformBalanceIntoDB,
  getAllPlatformBalancesFromDB,
  updatePlatformBalanceInDB,
  resetPlatformBalanceByName,
  resetAllBalancesFromDB,
};
