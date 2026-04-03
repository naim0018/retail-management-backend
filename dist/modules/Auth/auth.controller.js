"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const register = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.loginUser(req.body);
    const { accessToken, refreshToken, user } = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        data: { user },
    });
});
const logout = (0, catchAsync_1.default)(async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await auth_service_1.AuthService.getMe(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});
const updateMe = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await auth_service_1.AuthService.updateUser(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
exports.AuthController = {
    register,
    login,
    logout,
    getMe,
    updateMe,
};
