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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
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
    const jwtPayload = { email: user.email, role: user.role };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '10d',
    });
    return {
        accessToken,
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.AuthService = {
    registerUser,
    loginUser,
};
