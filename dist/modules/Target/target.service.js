"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetServices = void 0;
const mongoose_1 = require("mongoose");
const target_model_1 = require("./target.model");
const createTargetIntoDB = async (userId, payload) => {
    payload.userId = new mongoose_1.Types.ObjectId(userId);
    const result = await target_model_1.Target.create(payload);
    return result;
};
const getAllTargetsFromDB = async (userId) => {
    const result = await target_model_1.Target.find({ userId });
    return result;
};
const updateTargetInDB = async (userId, id, payload) => {
    const result = await target_model_1.Target.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
    return result;
};
const resetAllTargetsFromDB = async (userId) => {
    const result = await target_model_1.Target.deleteMany({ userId });
    return result;
};
exports.TargetServices = {
    createTargetIntoDB,
    getAllTargetsFromDB,
    updateTargetInDB,
    resetAllTargetsFromDB,
};
