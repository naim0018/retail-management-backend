"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceServices = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const platformBalance_model_1 = require("./platformBalance.model");
const transaction_model_1 = require("../Transaction/transaction.model");
const initializePlatformBalanceIntoDB = async (userId, payload) => {
    payload.userId = new mongoose_1.Types.ObjectId(userId);
    const result = await platformBalance_model_1.PlatformBalance.create(payload);
    return result;
};
const getAllPlatformBalancesFromDB = async (userId) => {
    const result = await platformBalance_model_1.PlatformBalance.find({ userId });
    return result;
};
const updatePlatformBalanceInDB = async (userId, id, balance) => {
    const result = await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ _id: id, userId }, { balance, lastUpdated: new Date() }, { new: true });
    return result;
};
const resetPlatformBalanceByName = async (userId, platformName, balance) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const uId = new mongoose_1.Types.ObjectId(userId);
        // 1. Update/Reset Platform Balance
        const updatedBalance = await platformBalance_model_1.PlatformBalance.findOneAndUpdate({ userId: uId, platformName }, { balance, lastUpdated: new Date() }, { new: true, upsert: true, session });
        // 2. Create a "Balance Reset" transaction record for history
        await transaction_model_1.Transaction.create([
            {
                userId: uId,
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
const resetAllBalancesFromDB = async (userId) => {
    const result = await platformBalance_model_1.PlatformBalance.updateMany({ userId }, { balance: 0, lastUpdated: new Date() });
    return result;
};
exports.PlatformBalanceServices = {
    initializePlatformBalanceIntoDB,
    getAllPlatformBalancesFromDB,
    updatePlatformBalanceInDB,
    resetPlatformBalanceByName,
    resetAllBalancesFromDB,
};
