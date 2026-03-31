"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalance = void 0;
const mongoose_1 = require("mongoose");
const platformBalanceSchema = new mongoose_1.Schema({
    platformName: {
        type: String,
        enum: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload'],
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.PlatformBalance = (0, mongoose_1.model)('PlatformBalance', platformBalanceSchema);
