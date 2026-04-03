import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import { User, TUserRole } from '../../modules/Auth/auth.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    // check if the given token is valid
    let decoded;
    try {
        decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
          ) as JwtPayload;
    } catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized token!');
    }

    const { role, userId } = decoded;

    // check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
    }
    // check if the user is already deleted
    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'You are not authorized!',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
