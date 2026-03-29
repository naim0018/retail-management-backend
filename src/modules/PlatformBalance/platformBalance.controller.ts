import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { PlatformBalanceServices } from './platformBalance.service';

const initializePlatformBalance = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformBalanceServices.initializePlatformBalanceIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Platform balance initialized successfully',
    data: result,
  });
});

const getAllPlatformBalances = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformBalanceServices.getAllPlatformBalancesFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Platform balances retrieved successfully',
    data: result,
  });
});

const updatePlatformBalance = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { balance } = req.body;
  const result = await PlatformBalanceServices.updatePlatformBalanceInDB(id, balance);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Platform balance updated successfully',
    data: result,
  });
});

const resetPlatformBalance = catchAsync(async (req: Request, res: Response) => {
  const { platformName, balance } = req.body;
  const result = await PlatformBalanceServices.resetPlatformBalanceByName(platformName, balance);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Platform balance reset successfully',
    data: result,
  });
});

const resetAllPlatformBalances = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformBalanceServices.resetAllBalancesFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All platform balances are reset successfully',
    data: result,
  });
});

export const PlatformBalanceControllers = {
  initializePlatformBalance,
  getAllPlatformBalances,
  updatePlatformBalance,
  resetPlatformBalance,
  resetAllPlatformBalances,
};
