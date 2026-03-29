import { Router } from 'express';
import { PlatformBalanceControllers } from './platformBalance.controller';
import validateRequest from '../../app/middleware/validateRequest';
import { PlatformBalanceValidation } from './platformBalance.validation';

const router = Router();

router.post(
  '/',
  validateRequest(PlatformBalanceValidation.createPlatformValidationSchema),
  PlatformBalanceControllers.initializePlatformBalance,
);

router.get('/', PlatformBalanceControllers.getAllPlatformBalances);

router.patch(
  '/:id',
  validateRequest(PlatformBalanceValidation.updateBalanceValidationSchema),
  PlatformBalanceControllers.updatePlatformBalance,
);

router.post(
  '/reset-balance',
  validateRequest(PlatformBalanceValidation.resetBalanceValidationSchema),
  PlatformBalanceControllers.resetPlatformBalance,
);

router.post('/reset-all-balances', PlatformBalanceControllers.resetAllPlatformBalances);

export const PlatformBalanceRoutes = router;
