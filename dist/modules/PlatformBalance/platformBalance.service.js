"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const platformBalance_model_1 = require("./platformBalance.model");
const transaction_model_1 = require("../Transaction/transaction.model");
const initializePlatformBalanceIntoDB = async (payload) => {
    const result = await platformBalance_model_1.PlatformBalance.create(payload);
    return result;
};
const getAllPlatformBalancesFromDB = async () => {
    const result = await platformBalance_model_1.PlatformBalance.find();
    return result;
};
const updatePlatformBalanceInDB = async (id, balance) => {
    const result = await platformBalance_model_1.PlatformBalance.findByIdAndUpdate(id, { balance, lastUpdated: new Date() }, { new: true });
    return result;
};
const resetPlatformBalanceByName = async (platformName, balance) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1. Update/Reset Platform Balance
        const updatedBalance = await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ platformName }, { balance, lastUpdated: new Date() }, { new: true, upsert: true, session });
        // 2. Create a "Balance Reset" transaction record for history
        await transaction_model_1.Transaction.create([
            {
                amount: balance,
                category: 'other',
                type: 'Balance Reset',
                platformName: platformName,
                actionName: platformName,
                status: 'success',
                profit: 0,
                notes: `Manual balance reset to ৳${balance}`,
            }
        ], { session });
        await session.commitTransaction();
        await session.endSession();
        return updatedBalance;
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
const resetAllBalancesFromDB = async () => {
    const result = await platformBalance_model_1.PlatformBalance.updateMany({}, { balance: 0, lastUpdated: new Date() });
    return result;
};
exports.PlatformBalanceServices = {
    initializePlatformBalanceIntoDB,
    getAllPlatformBalancesFromDB,
    updatePlatformBalanceInDB,
    resetPlatformBalanceByName,
    resetAllBalancesFromDB,
};
