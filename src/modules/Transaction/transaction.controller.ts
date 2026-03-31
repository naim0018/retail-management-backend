import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { TransactionServices } from './transaction.service';

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.createTransactionIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Transaction is created successfully',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.getAllTransactionsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transactions are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.getTransactionByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transaction is retrieved successfully',
    data: result,
  });
});

const getOverviewSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.getOverviewSummaryFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Overview Summary is retrieved successfully',
    data: result,
  });
});

const resetDailyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.resetDailyTransactionsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Today\'s transactions are reset successfully',
    data: result,
  });
});

const resetMonthlyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.resetMonthlyTransactionsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Month\'s transactions are reset successfully',
    data: result,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.updateTransactionInDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transaction is updated successfully',
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.deleteTransactionFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Transaction is deleted successfully',
    data: result,
  });
});

const clearDebt = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.clearDebtFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All debt records are cleared successfully',
    data: result,
  });
});

export const TransactionControllers = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
  getOverviewSummary,
  resetDailyTransactions,
  resetMonthlyTransactions,
  clearDebt,
};
