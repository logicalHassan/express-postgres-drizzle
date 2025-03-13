import { tokenTypes } from '@/config/tokens';
import { ApiError } from '@/utils';
import { isPasswordMatch } from '@/utils/passwordUtils';
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

const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.userId!);
    if (!user) {
      throw new Error('User Not Found With Token');
    }
    await userService.updateUser(user.id, { password: newPassword });
    await tokenService.deleteToken(user.id, tokenTypes.RESET_PASSWORD);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.userId!);
    if (!user) {
      throw new Error('User not found with verify Email token');
    }

    await tokenService.deleteToken(user.id, tokenTypes.VERIFY_EMAIL);
    await userService.updateUser(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmailAndPassword,
  resetPassword,
  verifyEmail,
};
