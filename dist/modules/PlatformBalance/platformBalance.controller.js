"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const platformBalance_service_1 = require("./platformBalance.service");
const initializePlatformBalance = (0, catchAsync_1.default)(async (req, res) => {
    const result = await platformBalance_service_1.PlatformBalanceServices.initializePlatformBalanceIntoDB(req.user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Platform balance initialized successfully',
        data: result,
    });
});
const getAllPlatformBalances = (0, catchAsync_1.default)(async (req, res) => {
    const result = await platformBalance_service_1.PlatformBalanceServices.getAllPlatformBalancesFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Platform balances retrieved successfully',
        data: result,
    });
});
const updatePlatformBalance = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { balance } = req.body;
    const result = await platformBalance_service_1.PlatformBalanceServices.updatePlatformBalanceInDB(req.user.userId, id, balance);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Platform balance updated successfully',
        data: result,
    });
});
const resetPlatformBalance = (0, catchAsync_1.default)(async (req, res) => {
    const { platformName, balance } = req.body;
    const result = await platformBalance_service_1.PlatformBalanceServices.resetPlatformBalanceByName(req.user.userId, platformName, balance);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Platform balance reset successfully',
        data: result,
    });
});
const resetAllPlatformBalances = (0, catchAsync_1.default)(async (req, res) => {
    const result = await platformBalance_service_1.PlatformBalanceServices.resetAllBalancesFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'All platform balances are reset successfully',
        data: result,
    });
});
exports.PlatformBalanceControllers = {
    initializePlatformBalance,
    getAllPlatformBalances,
    updatePlatformBalance,
    resetPlatformBalance,
    resetAllPlatformBalances,
};
