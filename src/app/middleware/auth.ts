import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import { User, TUserRole } from '../../modules/Auth/auth.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken || req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // check if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Token is missing! Are you logged in?');
    }

    // check if the given token is valid
    let decoded;
    try {
        decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
          ) as JwtPayload;
    } catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Token is invalid or expired!');
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
        `Role mismatch! Required: ${requiredRoles.join(', ')}. Got: ${role}`,
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
