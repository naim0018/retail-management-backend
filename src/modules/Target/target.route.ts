import { Router } from 'express';
import { TargetControllers } from './target.controller';
import validateRequest from '../../app/middleware/validateRequest';
import { TargetValidation } from './target.validation';
import auth from '../../app/middleware/auth';

const router = Router();

router.use(auth());

router.post(
  '/',
  validateRequest(TargetValidation.createTargetValidationSchema),
  TargetControllers.createTarget,
);

router.get('/', TargetControllers.getAllTargets);

router.patch(
  '/:id',
  validateRequest(TargetValidation.updateTargetValidationSchema),
  TargetControllers.updateTarget,
);

router.delete('/', TargetControllers.resetTargets);

export const TargetRoutes = router;
