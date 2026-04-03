import { Types } from 'mongoose';
import { TTarget } from './target.interface';
import { Target } from './target.model';

const createTargetIntoDB = async (userId: string | Types.ObjectId, payload: TTarget) => {
  payload.userId = new Types.ObjectId(userId);
  const result = await Target.create(payload);
  return result;
};

const getAllTargetsFromDB = async (userId: string | Types.ObjectId) => {
  const result = await Target.find({ userId });
  return result;
};

const updateTargetInDB = async (userId: string | Types.ObjectId, id: string, payload: Partial<TTarget>) => {
  const result = await Target.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
  return result;
};

const resetAllTargetsFromDB = async (userId: string | Types.ObjectId) => {
  const result = await Target.deleteMany({ userId });
  return result;
};

export const TargetServices = {
  createTargetIntoDB,
  getAllTargetsFromDB,
  updateTargetInDB,
  resetAllTargetsFromDB,
};
