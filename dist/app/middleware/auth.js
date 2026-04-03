"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../error/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth_model_1 = require("../../modules/Auth/auth.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const token = req.cookies.accessToken || req.headers.authorization;
        // check if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        // check if the given token is valid
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized token!');
        }
        const { role, userId } = decoded;
        // check if the user exists
        const user = await auth_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found!');
        }
        // check if the user is already deleted
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deleted!');
        }
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
