"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const mongoose_1 = require("mongoose");
const targetSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Target = (0, mongoose_1.model)('Target', targetSchema);
