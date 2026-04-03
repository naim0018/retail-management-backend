import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../app/config';
import AppError from '../../app/error/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken, user } = result;

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" as const : "lax" as const,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  res.cookie("accessToken", accessToken, cookieOptions);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: { user },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" as const : "lax" as const,
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const result = await AuthService.getMe(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const result = await AuthService.updateUser(userId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is missing!");
  }

  const result = await AuthService.refreshToken(token);
  const { accessToken } = result;

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" as const : "lax" as const,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  res.cookie("accessToken", accessToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: { accessToken },
  });
});

export const AuthController = {
  register,
  login,
  logout,
  getMe,
  updateMe,
  refreshToken,
};

