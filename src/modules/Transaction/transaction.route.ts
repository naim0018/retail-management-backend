import { Router } from 'express';
import { TransactionControllers } from './transaction.controller';
import validateRequest from '../../app/middleware/validateRequest';
import { TransactionValidation } from './transaction.validation';
import auth from '../../app/middleware/auth';

const router = Router();

router.use(auth());

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
router.patch(
  '/:id',
  validateRequest(TransactionValidation.updateTransactionValidationSchema),
  TransactionControllers.updateTransaction,
);
router.delete('/:id', TransactionControllers.deleteTransaction);

export const TransactionRoutes = router;
