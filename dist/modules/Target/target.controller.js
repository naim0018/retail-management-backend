"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const target_service_1 = require("./target.service");
const createTarget = (0, catchAsync_1.default)(async (req, res) => {
    // Provide default dates if not sent
    const payload = req.body;
    if (!payload.startDate)
        payload.startDate = new Date();
    if (!payload.endDate) {
        const end = new Date();
        if (payload.period === 'daily')
            end.setHours(23, 59, 59, 999);
        else if (payload.period === 'monthly')
            end.setMonth(end.getMonth() + 1);
        else if (payload.period === 'yearly')
            end.setFullYear(end.getFullYear() + 1);
        payload.endDate = end;
    }
    const result = await target_service_1.TargetServices.createTargetIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Target created successfully',
        data: result,
    });
});
const getAllTargets = (0, catchAsync_1.default)(async (req, res) => {
    const result = await target_service_1.TargetServices.getAllTargetsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Targets retrieved successfully',
        data: result,
    });
});
const updateTarget = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await target_service_1.TargetServices.updateTargetInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Target updated successfully',
        data: result,
    });
});
const resetTargets = (0, catchAsync_1.default)(async (req, res) => {
    const result = await target_service_1.TargetServices.resetAllTargetsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Targets are reset successfully',
        data: result,
    });
});
exports.TargetControllers = {
    createTarget,
    getAllTargets,
    updateTarget,
    resetTargets,
};
