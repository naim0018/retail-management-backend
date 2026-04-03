import config from '../../app/config';
import AppError from '../../app/error/AppError';
import { User, IUser } from './auth.model';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { createToken } from './auth.utils';

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

  const jwtPayload = { 
    email: user.email, 
    role: user.role, 
    userId: user._id.toString(), 
    name: user.name 
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, '10d');
  const refreshToken = createToken(jwtPayload, config.jwt_access_secret as string, '30d');

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (payload.password) {
    user.password = payload.password;
  }
  if (payload.name) user.name = payload.name;
  if (payload.profileImage) user.profileImage = payload.profileImage;
  if (payload.dashboardName) user.dashboardName = payload.dashboardName;

  await user.save();
  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
};
