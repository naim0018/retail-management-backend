"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: 0 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    profileImage: { type: String, default: '' },
    dashboardName: { type: String, default: 'My Retailer' },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt_1.default.hash(this.password, 12);
    }
    next();
});
// Remove password from responses
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.isDeleted;
        return ret;
    },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
