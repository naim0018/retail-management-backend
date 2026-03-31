import mongoose from 'mongoose';
import { TTransaction } from './transaction.interface';
import { Transaction } from './transaction.model';
import { PlatformBalance } from '../PlatformBalance/platformBalance.model';

// ─── Rate Constants ──────────────────────────────────────────────────────────

const COMMISSION_RATE = 0.0041;
const BKASH_COMMISSION_RATE = 0.00375;
const FLEXILOAD_PROFIT_RATE = 0.027;
const PHOTOCOPY_PROFIT_RATE = 0.5;          // 5tk per 2 copies → 2.5tk profit
const PRINTING_PROFIT_RATE = 2 / 3;         // 10tk per 2/3 pages → 6.67tk profit

// Actions that add to the Main Wallet balance
const ADD_TO_WALLET_ACTIONS = [
  'Photocopy',
  'Printing',
  'Customer Service',
  'Inflow',
  'Flexiload',
  'Meter Recharge',
] as const;

// Actions that deduct from the Main Wallet balance
const CUT_FROM_WALLET_ACTIONS = [
  'Personal Expenses',
  'Shop Expenses',
  'Outflow',
  'Lending Money',
  'Debt',
] as const;

// Mobile banking types that count towards Sales
const SALES_TYPES = ['Cash In', 'Cash Out'] as const;

// Other-category actions that count towards Sales
const SALES_ACTION_NAMES = [
  'Flexiload',
  'Photocopy',
  'Printing',
  'Customer Service',
] as const;

// ─── Create Transaction ───────────────────────────────────────────────────────

const createTransactionIntoDB = async (payload: TTransaction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let profit = 0;
    const actionName = payload.actionName || '';
    const amount = payload.amount;
    const type = payload.type;

    // ── Profit Calculation ──────────────────────────────────────────────────
    if (payload.category === 'mobile_banking') {
      // Only Cash In / Cash Out earn commission — B2B earns nothing
      if (type === 'Cash In' || type === 'Cash Out') {
        profit =
          actionName === 'bKash'
            ? amount * BKASH_COMMISSION_RATE
            : amount * COMMISSION_RATE;
      }
    } else if (actionName === 'Flexiload') {
      profit = amount * FLEXILOAD_PROFIT_RATE;
    } else if (actionName === 'Photocopy') {
      profit = amount * PHOTOCOPY_PROFIT_RATE;
    } else if (actionName === 'Printing') {
      profit = amount * PRINTING_PROFIT_RATE;
    } else if (actionName === 'Customer Service') {
      profit = amount; // Full amount is profit (card service)
    }
    // Inflow, Outflow, Expenses, Debt, Lending Money → profit = 0

    // ── Custom Profit Override ──────────────────────────────────────────────
    // If the frontend explicitly provides a customProfit, it takes precedence
    // over the backend-calculated value. This allows manual adjustments.
    if (typeof payload.customProfit === 'number' && !isNaN(payload.customProfit)) {
      profit = payload.customProfit;
    }

    payload.profit = profit;

    // ── Platform Balance Updates ────────────────────────────────────────────
    if (payload.category === 'mobile_banking') {
      const platformName = payload.platformName;

      if (type === 'Cash In') {
        // Customer brings cash → you load from bKash → bKash ↓, Main Wallet ↑
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
        if (platformName) {
          await PlatformBalance.findOneAndUpdate(
            { platformName },
            { $inc: { balance: -amount + profit }, lastUpdated: new Date() },
            { session, upsert: true },
          );
        }
      } else if (type === 'Cash Out') {
        // Customer wants cash → sends to your bKash → bKash ↑, Main Wallet ↓
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: -amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
        if (platformName) {
          await PlatformBalance.findOneAndUpdate(
            { platformName },
            { $inc: { balance: amount + profit }, lastUpdated: new Date() },
            { session, upsert: true },
          );
        }
      } else if (type === 'B2B In') {
        // Another agent sends to your bKash → you give cash → bKash ↑, Main Wallet ↓
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: -amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
        if (platformName) {
          await PlatformBalance.findOneAndUpdate(
            { platformName },
            { $inc: { balance: amount + profit }, lastUpdated: new Date() },
            { session, upsert: true },
          );
        }
      } else if (type === 'B2B Out') {
        // You send from bKash to another agent → they give you cash → bKash ↓, Main Wallet ↑
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
        if (platformName) {
          await PlatformBalance.findOneAndUpdate(
            { platformName },
            { $inc: { balance: -amount + profit }, lastUpdated: new Date() },
            { session, upsert: true },
          );
        }
      }
    } else {
      // Other category balance updates
      if ((ADD_TO_WALLET_ACTIONS as readonly string[]).includes(actionName)) {
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
      } else if ((CUT_FROM_WALLET_ACTIONS as readonly string[]).includes(actionName)) {
        await PlatformBalance.findOneAndUpdate(
          { platformName: 'Main Wallet' },
          { $inc: { balance: -amount }, lastUpdated: new Date() },
          { session, upsert: true },
        );
      }
      // Lending Money: no balance change (tracked for records)
    }

    const result = await Transaction.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// ─── Read Operations ──────────────────────────────────────────────────────────

const getAllTransactionsFromDB = async () => {
  const result = await Transaction.find().sort({ createdAt: -1 });
  return result;
};

const getTransactionByIdFromDB = async (id: string) => {
  const result = await Transaction.findById(id);
  return result;
};

// ─── Overview Summary ─────────────────────────────────────────────────────────

const getOverviewSummaryFromDB = async () => {
  const now = new Date();

  // Today boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Current month start
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = await Transaction.aggregate([
    {
      $facet: {
        // Month-scoped master stats
        monthStats: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          {
            $group: {
              _id: null,
              // Sales = mobile Cash In/Out + other sales services
              totalSales: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ['$category', 'mobile_banking'] },
                            { $in: ['$type', [...SALES_TYPES]] },
                          ],
                        },
                        { $in: ['$actionName', [...SALES_ACTION_NAMES]] },
                      ],
                    },
                    '$amount',
                    0,
                  ],
                },
              },
              totalNetProfit: { $sum: '$profit' },
              // Debt is tracked separately (not part of sales)
              totalDebt: {
                $sum: {
                  $cond: [{ $eq: ['$actionName', 'Debt'] }, '$amount', 0],
                },
              },
            },
          },
        ],

        // Today-scoped stats
        todayStats: [
          { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
          {
            $group: {
              _id: null,
              salesToday: {
                $sum: {
                  $cond: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ['$category', 'mobile_banking'] },
                            { $in: ['$type', [...SALES_TYPES]] },
                          ],
                        },
                        { $in: ['$actionName', [...SALES_ACTION_NAMES]] },
                      ],
                    },
                    '$amount',
                    0,
                  ],
                },
              },
              profitToday: { $sum: '$profit' },
            },
          },
        ],
      },
    },
  ]);

  const platformBalances = await PlatformBalance.find();
  const totalBalance = platformBalances.reduce((acc, curr) => acc + curr.balance, 0);
  const mainWalletBalance =
    platformBalances.find((p) => p.platformName === 'Main Wallet')?.balance || 0;

  return {
    totalSales: stats[0].monthStats[0]?.totalSales || 0,
    totalNetProfit: stats[0].monthStats[0]?.totalNetProfit || 0,
    totalDebt: stats[0].monthStats[0]?.totalDebt || 0,
    salesToday: stats[0].todayStats[0]?.salesToday || 0,
    profitToday: stats[0].todayStats[0]?.profitToday || 0,
    totalBalance,
    mainWalletBalance,
  };
};

const resetDailyTransactionsFromDB = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const result = await Transaction.deleteMany({
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });
  return result;
};

const resetMonthlyTransactionsFromDB = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await Transaction.deleteMany({
    createdAt: { $gte: startOfMonth },
  });
  return result;
};

const clearDebtFromDB = async () => {
  const result = await Transaction.deleteMany({ actionName: 'Debt' });
  return result;
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const TransactionServices = {
  createTransactionIntoDB,
  getAllTransactionsFromDB,
  getTransactionByIdFromDB,
  getOverviewSummaryFromDB,
  resetDailyTransactionsFromDB,
  resetMonthlyTransactionsFromDB,
  clearDebtFromDB,
};
