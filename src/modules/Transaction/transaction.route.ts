import { Router } from 'express';
import { TransactionControllers } from './transaction.controller';
import validateRequest from '../../app/middleware/validateRequest';
import { TransactionValidation } from './transaction.validation';

const router = Router();

router.post(
  '/',
  validateRequest(TransactionValidation.createTransactionValidationSchema),
  TransactionControllers.createTransaction,
);

router.get('/get-summary', TransactionControllers.getOverviewSummary);

router.post('/reset-daily', TransactionControllers.resetDailyTransactions);
router.post('/reset-monthly', TransactionControllers.resetMonthlyTransactions);
router.post('/clear-debt', TransactionControllers.clearDebt);

router.get('/', TransactionControllers.getAllTransactions);

router.get('/:id', TransactionControllers.getTransactionById);

export const TransactionRoutes = router;
