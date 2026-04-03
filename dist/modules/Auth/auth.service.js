"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../app/config"));
const AppError_1 = __importDefault(require("../../app/error/AppError"));
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const auth_utils_1 = require("./auth.utils");
const registerUser = async (payload) => {
    const isUserExist = await auth_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'User already exists!');
    }
    const result = await auth_model_1.User.create(payload);
    return result;
};
const loginUser = async (payload) => {
    const user = await auth_model_1.User.findOne({ email: payload.email }).select('password role isDeleted email name');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User is deleted!');
    }
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Invalid password!');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        userId: user._id.toString(),
        name: user.name
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '10d');
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '30d');
    return {
        accessToken,
        refreshToken,
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
const getMe = async (userId) => {
    const result = await auth_model_1.User.findById(userId);
    return result;
};
const updateUser = async (userId, payload) => {
    const user = await auth_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    if (payload.password) {
        user.password = payload.password;
    }
    if (payload.name)
        user.name = payload.name;
    if (payload.profileImage)
        user.profileImage = payload.profileImage;
    if (payload.dashboardName)
        user.dashboardName = payload.dashboardName;
    await user.save();
    return user;
};
exports.AuthService = {
    registerUser,
    loginUser,
    getMe,
    updateUser,
};
