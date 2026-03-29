"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
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
        enum: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet'],
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
}, {
    timestamps: true,
});
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
