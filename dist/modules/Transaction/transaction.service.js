"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = require("./transaction.model");
const platformBalance_model_1 = require("../PlatformBalance/platformBalance.model");
// ─── Rate Constants ──────────────────────────────────────────────────────────
const COMMISSION_RATE = 0.0041;
const BKASH_COMMISSION_RATE = 0.00375;
const FLEXILOAD_PROFIT_RATE = 0.027;
const PHOTOCOPY_PROFIT_RATE = 0.5; // 5tk per 2 copies → 2.5tk profit
const PRINTING_PROFIT_RATE = 2 / 3; // 10tk per 2/3 pages → 6.67tk profit
// Actions that add to the Main Wallet balance
const ADD_TO_WALLET_ACTIONS = [
    'Photocopy',
    'Printing',
    'Customer Service',
    'Inflow',
    'Flexiload',
    'Meter Recharge',
];
// Actions that deduct from the Main Wallet balance
const CUT_FROM_WALLET_ACTIONS = [
    'Personal Expenses',
    'Shop Expenses',
    'Outflow',
    'Lending Money',
    'Debt',
];
// Mobile banking types that count towards Sales
const SALES_TYPES = ['Cash In', 'Cash Out'];
// Other-category actions that count towards Sales
const SALES_ACTION_NAMES = [
    'Flexiload',
    'Photocopy',
    'Printing',
    'Customer Service',
];
// ─── Create Transaction ───────────────────────────────────────────────────────
const createTransactionIntoDB = async (payload) => {
    const session = await mongoose_1.default.startSession();
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
        }
        else if (actionName === 'Flexiload') {
            profit = amount * FLEXILOAD_PROFIT_RATE;
        }
        else if (actionName === 'Photocopy') {
            profit = amount * PHOTOCOPY_PROFIT_RATE;
        }
        else if (actionName === 'Printing') {
            profit = amount * PRINTING_PROFIT_RATE;
        }
        else if (actionName === 'Customer Service') {
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
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
                if (platformName) {
                    await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
                }
            }
            else if (type === 'Cash Out') {
                // Customer wants cash → sends to your bKash → bKash ↑, Main Wallet ↓
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
                if (platformName) {
                    await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
                }
            }
            else if (type === 'B2B In') {
                // Another agent sends to your bKash → you give cash → bKash ↑, Main Wallet ↓
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
                if (platformName) {
                    await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
                }
            }
            else if (type === 'B2B Out') {
                // You send from bKash to another agent → they give you cash → bKash ↓, Main Wallet ↑
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
                if (platformName) {
                    await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
                }
            }
        }
        else {
            // Other category balance updates
            if (ADD_TO_WALLET_ACTIONS.includes(actionName)) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
            }
            else if (CUT_FROM_WALLET_ACTIONS.includes(actionName)) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: 'Main Wallet' }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
            }
            // Lending Money: no balance change (tracked for records)
        }
        const result = await transaction_model_1.Transaction.create([payload], { session });
        await session.commitTransaction();
        await session.endSession();
        return result[0];
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
// ─── Read Operations ──────────────────────────────────────────────────────────
const getAllTransactionsFromDB = async () => {
    const result = await transaction_model_1.Transaction.find().sort({ createdAt: -1 });
    return result;
};
const getTransactionByIdFromDB = async (id) => {
    const result = await transaction_model_1.Transaction.findById(id);
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
    const stats = await transaction_model_1.Transaction.aggregate([
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
    const platformBalances = await platformBalance_model_1.PlatformBalance.find();
    const totalBalance = platformBalances.reduce((acc, curr) => acc + curr.balance, 0);
    const mainWalletBalance = platformBalances.find((p) => p.platformName === 'Main Wallet')?.balance || 0;
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
    const result = await transaction_model_1.Transaction.deleteMany({
        createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    return result;
};
const resetMonthlyTransactionsFromDB = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await transaction_model_1.Transaction.deleteMany({
        createdAt: { $gte: startOfMonth },
    });
    return result;
};
const clearDebtFromDB = async () => {
    const result = await transaction_model_1.Transaction.deleteMany({ actionName: 'Debt' });
    return result;
};
// ─── Exports ──────────────────────────────────────────────────────────────────
exports.TransactionServices = {
    createTransactionIntoDB,
    getAllTransactionsFromDB,
    getTransactionByIdFromDB,
    getOverviewSummaryFromDB,
    resetDailyTransactionsFromDB,
    resetMonthlyTransactionsFromDB,
    clearDebtFromDB,
};
