"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetRoutes = void 0;
const express_1 = require("express");
const target_controller_1 = require("./target.controller");
const validateRequest_1 = __importDefault(require("../../app/middleware/validateRequest"));
const target_validation_1 = require("./target.validation");
const auth_1 = __importDefault(require("../../app/middleware/auth"));
const router = (0, express_1.Router)();
router.use((0, auth_1.default)());
router.post('/', (0, validateRequest_1.default)(target_validation_1.TargetValidation.createTargetValidationSchema), target_controller_1.TargetControllers.createTarget);
router.get('/', target_controller_1.TargetControllers.getAllTargets);
router.patch('/:id', (0, validateRequest_1.default)(target_validation_1.TargetValidation.updateTargetValidationSchema), target_controller_1.TargetControllers.updateTarget);
router.delete('/', target_controller_1.TargetControllers.resetTargets);
exports.TargetRoutes = router;
