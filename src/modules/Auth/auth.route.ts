import { Router } from 'express';
import validateRequest from '../../app/middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

import { USER_ROLE } from './auth.constant';
import auth from '../../app/middleware/auth';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.getMe
);

router.patch(
  '/update-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.updateMe
);

router.post(
  '/logout',
  AuthController.logout
);

export const AuthRoute = router;