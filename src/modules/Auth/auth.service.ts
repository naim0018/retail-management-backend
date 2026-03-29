import config from '../../app/config';
import AppError from '../../app/error/AppError';
import { User, IUser } from './auth.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, 'User already exists!');
  }

  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email }).select('password role isDeleted email name');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted!');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password as string,
    user.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid password!');
  }

  const jwtPayload = { email: user.email, role: user.role };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
