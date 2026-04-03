"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalance = void 0;
const mongoose_1 = require("mongoose");
const platformBalanceSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    platformName: {
        type: String,
        enum: ['bKash', 'bKash (P)', 'bKash (M)', 'Nagad', 'Rocket', 'Upay', 'Tap', 'mCash', 'Main Wallet', 'Flexiload'],
        required: true,
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
platformBalanceSchema.index({ userId: 1, platformName: 1 }, { unique: true });
exports.PlatformBalance = (0, mongoose_1.model)('PlatformBalance', platformBalanceSchema);
