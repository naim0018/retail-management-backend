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
    "Photocopy",
    "Printing",
    "Customer Service",
    "Inflow",
    "Meter Recharge",
];
// Actions that deduct from the Main Wallet balance
const CUT_FROM_WALLET_ACTIONS = [
    "Personal Expenses",
    "Shop Expenses",
    "Outflow",
    "Lending Money",
    "Debt",
];
// Mobile banking types that count towards Sales
const SALES_TYPES = ["Cash In", "Cash Out"];
// Other-category actions that count towards Sales
const SALES_ACTION_NAMES = [
    "Flexiload",
    "Photocopy",
    "Printing",
    "Customer Service",
];
// ─── Balance Adjustment Helper ───────────────────────────────────────────────
const adjustPlatformBalance = async (transaction, session, isReverse = false) => {
    const amount = isReverse ? -transaction.amount : transaction.amount;
    const profit = isReverse
        ? -(transaction.profit || 0)
        : transaction.profit || 0;
    const actionName = transaction.actionName || "";
    const type = transaction.type;
    const platformName = transaction.platformName;
    if (transaction.category === "mobile_banking") {
        if (type === "Cash In") {
            // Create: Main Wallet +amount, Platform -amount +profit
            // Reverse: Main Wallet -amount, Platform +amount -profit
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
            if (platformName) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: -amount + profit }, lastUpdated: new Date() }, { session, upsert: true });
            }
        }
        else if (type === "Cash Out") {
            // Create: Main Wallet -amount, Platform +amount +profit
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
            if (platformName) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: amount + profit }, lastUpdated: new Date() }, { session, upsert: true });
            }
        }
        else if (type === "B2B In") {
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
            if (platformName) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: amount + profit }, lastUpdated: new Date() }, { session, upsert: true });
            }
        }
        else if (type === "B2B Out") {
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
            if (platformName) {
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { $inc: { balance: -amount + profit }, lastUpdated: new Date() }, { session, upsert: true });
            }
        }
    }
    else {
        // Other category balance updates
        if (actionName === "Flexiload") {
            if (type === "Add Balance") {
                // Cash leaves Main Wallet, Digital balance enters Flexiload
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Flexiload" }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
            }
            else {
                // Normal Flexiload (send): Cash enters Main Wallet, Digital balance leaves Flexiload
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
                await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Flexiload" }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
            }
        }
        else if (ADD_TO_WALLET_ACTIONS.includes(actionName)) {
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: amount }, lastUpdated: new Date() }, { session, upsert: true });
        }
        else if (CUT_FROM_WALLET_ACTIONS.includes(actionName)) {
            await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName: "Main Wallet" }, { $inc: { balance: -amount }, lastUpdated: new Date() }, { session, upsert: true });
        }
    }
};
// ─── Create Transaction ───────────────────────────────────────────────────────
const createTransactionIntoDB = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        let profit = 0;
        const actionName = payload.actionName || "";
        const amount = payload.amount;
        const type = payload.type;
        // ── Profit Calculation ──────────────────────────────────────────────────
        if (payload.category === "mobile_banking") {
            if (type === "Cash In" || type === "Cash Out") {
                profit =
                    actionName === "bKash"
                        ? amount * BKASH_COMMISSION_RATE
                        : amount * COMMISSION_RATE;
            }
        }
        else if (actionName === "Flexiload") {
            profit = type === "Add Balance" ? 0 : amount * FLEXILOAD_PROFIT_RATE;
        }
        else if (actionName === "Photocopy") {
            profit = amount * PHOTOCOPY_PROFIT_RATE;
        }
        else if (actionName === "Printing") {
            profit = amount * PRINTING_PROFIT_RATE;
        }
        else if (actionName === "Customer Service") {
            profit = amount;
        }
        if (typeof payload.customProfit === "number" &&
            !isNaN(payload.customProfit)) {
            profit = payload.customProfit;
        }
        payload.profit = profit;
        // ── Platform Balance Updates ────────────────────────────────────────────
        await adjustPlatformBalance(payload, session);
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
const updateTransactionInDB = async (id, payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const oldTransaction = await transaction_model_1.Transaction.findById(id).session(session);
        if (!oldTransaction) {
            throw new Error("Transaction not found");
        }
        // 1. Reverse old balance impact
        await adjustPlatformBalance(oldTransaction.toObject(), session, true);
        // 2. Merge payload with old transaction to calculate new profit
        const updatedData = { ...oldTransaction.toObject(), ...payload };
        let profit = 0;
        const actionName = updatedData.actionName || "";
        const amount = updatedData.amount;
        const type = updatedData.type;
        // Identify if customProfit is explicitly provided in this update request
        const isCustomProfitProvided = "customProfit" in payload && payload.customProfit !== undefined;
        if (updatedData.category === "mobile_banking") {
            if (type === "Cash In" || type === "Cash Out") {
                profit =
                    actionName === "bKash"
                        ? amount * BKASH_COMMISSION_RATE
                        : amount * COMMISSION_RATE;
            }
        }
        else if (actionName === "Flexiload") {
            profit = type === "Add Balance" ? 0 : amount * FLEXILOAD_PROFIT_RATE;
        }
        else if (actionName === "Photocopy") {
            profit = amount * PHOTOCOPY_PROFIT_RATE;
        }
        else if (actionName === "Printing") {
            profit = amount * PRINTING_PROFIT_RATE;
        }
        else if (actionName === "Customer Service") {
            profit = amount;
        }
        // Use customProfit if explicitly provided in payload, OR if it already existed and wasn't intended to be overridden by a new amount calculation
        if (isCustomProfitProvided) {
            profit = payload.customProfit;
        }
        else if (!("amount" in payload) &&
            typeof oldTransaction.customProfit === "number" &&
            !isNaN(oldTransaction.customProfit)) {
            // If amount isn't changing and old transaction had customProfit, keep it
            profit = oldTransaction.customProfit;
        }
        updatedData.profit = profit;
        // If no customProfit provided in this update, ensure we're not carrying over an old one if it's supposed to be recalculated
        if (!isCustomProfitProvided && "amount" in payload) {
            updatedData.customProfit = undefined;
        }
        // 3. Apply new balance impact
        await adjustPlatformBalance(updatedData, session);
        // 4. Update in DB
        const result = await transaction_model_1.Transaction.findByIdAndUpdate(id, updatedData, {
            new: true,
            session,
        });
        await session.commitTransaction();
        await session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
const deleteTransactionFromDB = async (id) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const transaction = await transaction_model_1.Transaction.findById(id).session(session);
        if (!transaction) {
            throw new Error("Transaction not found");
        }
        // Reverse balance impact
        await adjustPlatformBalance(transaction.toObject(), session, true);
        const result = await transaction_model_1.Transaction.findByIdAndDelete(id, { session });
        await session.commitTransaction();
        await session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
// ─── Read Operations ──────────────────────────────────────────────────────────
const getAllTransactionsFromDB = async (query) => {
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = -1, searchTerm, category, type, status, actionName, startDate, endDate, } = query;
    const mongoQuery = {};
    // Filtering
    if (category)
        mongoQuery.category = category;
    if (type)
        mongoQuery.type = type;
    if (status)
        mongoQuery.status = status;
    if (actionName)
        mongoQuery.actionName = actionName;
    // Date Range Filtering
    if (startDate || endDate) {
        mongoQuery.createdAt = {};
        if (startDate)
            mongoQuery.createdAt.$gte = new Date(startDate);
        if (endDate)
            mongoQuery.createdAt.$lte = new Date(endDate);
    }
    // Search by actionName or operator
    if (searchTerm) {
        mongoQuery.$or = [
            { actionName: { $regex: searchTerm, $options: 'i' } },
            { operator: { $regex: searchTerm, $options: 'i' } },
            { referenceId: { $regex: searchTerm, $options: 'i' } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: Number(sortOrder) };
    const result = await transaction_model_1.Transaction.find(mongoQuery)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));
    const total = await transaction_model_1.Transaction.countDocuments(mongoQuery);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
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
                                                        { $eq: ["$category", "mobile_banking"] },
                                                        { $in: ["$type", [...SALES_TYPES]] },
                                                    ],
                                                },
                                                {
                                                    $and: [
                                                        { $in: ["$actionName", [...SALES_ACTION_NAMES]] },
                                                        { $ne: ["$type", "Add Balance"] },
                                                    ],
                                                },
                                            ],
                                        },
                                        "$amount",
                                        0,
                                    ],
                                },
                            },
                            totalNetProfit: { $sum: "$profit" },
                            // Debt is tracked separately (not part of sales)
                            totalDebt: {
                                $sum: {
                                    $cond: [{ $eq: ["$actionName", "Debt"] }, "$amount", 0],
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
                                                        { $eq: ["$category", "mobile_banking"] },
                                                        { $in: ["$type", [...SALES_TYPES]] },
                                                    ],
                                                },
                                                {
                                                    $and: [
                                                        { $in: ["$actionName", [...SALES_ACTION_NAMES]] },
                                                        { $ne: ["$type", "Add Balance"] },
                                                    ],
                                                },
                                            ],
                                        },
                                        "$amount",
                                        0,
                                    ],
                                },
                            },
                            profitToday: { $sum: "$profit" },
                        },
                    },
                ],
            },
        },
    ]);
    const platformBalances = await platformBalance_model_1.PlatformBalance.find();
    const totalBalance = platformBalances.reduce((acc, curr) => acc + curr.balance, 0);
    const mainWalletBalance = platformBalances.find((p) => p.platformName === "Main Wallet")?.balance ||
        0;
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
    const result = await transaction_model_1.Transaction.deleteMany({ actionName: "Debt" });
    return result;
};
// ─── Exports ──────────────────────────────────────────────────────────────────
exports.TransactionServices = {
    createTransactionIntoDB,
    updateTransactionInDB,
    deleteTransactionFromDB,
    getAllTransactionsFromDB,
    getTransactionByIdFromDB,
    getOverviewSummaryFromDB,
    resetDailyTransactionsFromDB,
    resetMonthlyTransactionsFromDB,
    clearDebtFromDB,
};
