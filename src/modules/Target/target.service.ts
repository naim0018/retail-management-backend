import { TTarget } from './target.interface';
import { Target } from './target.model';

const createTargetIntoDB = async (payload: TTarget) => {
  // if startDate and endDate are not provided correctly in payload, we handle it in controller or pre-save hook, but assuming valid payload here.
  const result = await Target.create(payload);
  return result;
};

const getAllTargetsFromDB = async () => {
  const result = await Target.find();
  return result;
};

const updateTargetInDB = async (id: string, payload: Partial<TTarget>) => {
  const result = await Target.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const resetAllTargetsFromDB = async () => {
  const result = await Target.deleteMany({});
  return result;
};

export const TargetServices = {
  createTargetIntoDB,
  getAllTargetsFromDB,
  updateTargetInDB,
  resetAllTargetsFromDB,
};
