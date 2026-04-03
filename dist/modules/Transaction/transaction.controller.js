"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const transaction_service_1 = require("./transaction.service");
const createTransaction = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.createTransactionIntoDB(req.user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Transaction is created successfully',
        data: result,
    });
});
const getAllTransactions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.getAllTransactionsFromDB(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Transactions are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getTransactionById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await transaction_service_1.TransactionServices.getTransactionByIdFromDB(req.user.userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Transaction is retrieved successfully',
        data: result,
    });
});
const getOverviewSummary = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.getOverviewSummaryFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Overview Summary is retrieved successfully',
        data: result,
    });
});
const resetDailyTransactions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.resetDailyTransactionsFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Today\'s transactions are reset successfully',
        data: result,
    });
});
const resetMonthlyTransactions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.resetMonthlyTransactionsFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Month\'s transactions are reset successfully',
        data: result,
    });
});
const updateTransaction = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await transaction_service_1.TransactionServices.updateTransactionInDB(req.user.userId, id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Transaction is updated successfully',
        data: result,
    });
});
const deleteTransaction = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await transaction_service_1.TransactionServices.deleteTransactionFromDB(req.user.userId, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Transaction is deleted successfully',
        data: result,
    });
});
const clearDebt = (0, catchAsync_1.default)(async (req, res) => {
    const result = await transaction_service_1.TransactionServices.clearDebtFromDB(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'All debt records are cleared successfully',
        data: result,
    });
});
exports.TransactionControllers = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
    getTransactionById,
    getOverviewSummary,
    resetDailyTransactions,
    resetMonthlyTransactions,
    clearDebt,
};
