import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { TargetServices } from './target.service';

const createTarget = catchAsync(async (req: Request, res: Response) => {
  // Provide default dates if not sent
  const payload = req.body;
  if (!payload.startDate) payload.startDate = new Date();
  if (!payload.endDate) {
    const end = new Date();
    if (payload.period === 'daily') end.setHours(23, 59, 59, 999);
    else if (payload.period === 'monthly') end.setMonth(end.getMonth() + 1);
    else if (payload.period === 'yearly') end.setFullYear(end.getFullYear() + 1);
    payload.endDate = end;
  }

  const result = await TargetServices.createTargetIntoDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Target created successfully',
    data: result,
  });
});

const getAllTargets = catchAsync(async (req: Request, res: Response) => {
  const result = await TargetServices.getAllTargetsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Targets retrieved successfully',
    data: result,
  });
});

const updateTarget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TargetServices.updateTargetInDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Target updated successfully',
    data: result,
  });
});

const resetTargets = catchAsync(async (req: Request, res: Response) => {
  const result = await TargetServices.resetAllTargetsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Targets are reset successfully',
    data: result,
  });
});

export const TargetControllers = {
  createTarget,
  getAllTargets,
  updateTarget,
  resetTargets,
};
