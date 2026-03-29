"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBalanceRoutes = void 0;
const express_1 = require("express");
const platformBalance_controller_1 = require("./platformBalance.controller");
const validateRequest_1 = __importDefault(require("../../app/middleware/validateRequest"));
const platformBalance_validation_1 = require("./platformBalance.validation");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(platformBalance_validation_1.PlatformBalanceValidation.createPlatformValidationSchema), platformBalance_controller_1.PlatformBalanceControllers.initializePlatformBalance);
router.get('/', platformBalance_controller_1.PlatformBalanceControllers.getAllPlatformBalances);
router.patch('/:id', (0, validateRequest_1.default)(platformBalance_validation_1.PlatformBalanceValidation.updateBalanceValidationSchema), platformBalance_controller_1.PlatformBalanceControllers.updatePlatformBalance);
router.post('/reset-balance', (0, validateRequest_1.default)(platformBalance_validation_1.PlatformBalanceValidation.resetBalanceValidationSchema), platformBalance_controller_1.PlatformBalanceControllers.resetPlatformBalance);
router.post('/reset-all-balances', platformBalance_controller_1.PlatformBalanceControllers.resetAllPlatformBalances);
exports.PlatformBalanceRoutes = router;
