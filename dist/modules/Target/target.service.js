"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetServices = void 0;
const target_model_1 = require("./target.model");
const createTargetIntoDB = async (payload) => {
    // if startDate and endDate are not provided correctly in payload, we handle it in controller or pre-save hook, but assuming valid payload here.
    const result = await target_model_1.Target.create(payload);
    return result;
};
const getAllTargetsFromDB = async () => {
    const result = await target_model_1.Target.find();
    return result;
};
const updateTargetInDB = async (id, payload) => {
    const result = await target_model_1.Target.findByIdAndUpdate(id, payload, { new: true });
    return result;
};
const resetAllTargetsFromDB = async () => {
    const result = await target_model_1.Target.deleteMany({});
    return result;
};
exports.TargetServices = {
    createTargetIntoDB,
    getAllTargetsFromDB,
    updateTargetInDB,
    resetAllTargetsFromDB,
};
