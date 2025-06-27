import { tokenTypes } from '@/config/tokens';
import { ApiError } from '@/utils';
import { isPasswordMatch } from '@/utils/password-hash';
import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';

const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await isPasswordMatch(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken: string) => {
  try {
    const { user } = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    if (!user) {
      throw new Error('User not found for refresh token');
    }

    await tokenService.deleteToken(user.id, tokenTypes.REFRESH);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Logout failed');
  }
};

const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const { user } = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);

    if (!user) {
      throw new Error('User Not Found With Token');
    }

    await userService.updateUser(user.id, { password: newPassword });
    await tokenService.deleteToken(user.id, tokenTypes.RESET_PASSWORD);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const { user } = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    if (!user) {
      throw new Error('User Not Found With Token');
    }

    await tokenService.deleteToken(user.id, tokenTypes.REFRESH);
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const { user } = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);

    if (!user) {
      throw new Error('User not found with verify Email token');
    }

    await userService.updateUser(user.id, { isEmailVerified: true });
    await tokenService.deleteToken(user.id, tokenTypes.VERIFY_EMAIL);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
