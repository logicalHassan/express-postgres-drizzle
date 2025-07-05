import type { authValidation, userValidation } from '@/validations';
import type { z } from 'zod';

type RegisterBody = z.infer<typeof authValidation.register.body>;
type LoginBody = z.infer<typeof authValidation.login.body>;
type LogoutBody = z.infer<typeof authValidation.logout.body>;
type RefreshTokensBody = z.infer<typeof authValidation.refreshTokens.body>;
type ForgotPasswordBody = z.infer<typeof authValidation.forgotPassword.body>;
type ResetPasswordQuery = z.infer<typeof authValidation.resetPassword.query>;
type ResetPasswordBody = z.infer<typeof authValidation.resetPassword.body>;
type VerifyEmailQuery = z.infer<typeof authValidation.verifyEmail.query>;
type CreateUserBody = z.infer<typeof userValidation.createUser.body>;
type GetUsersQuery = z.infer<typeof userValidation.getUsers.query>;
type GetUserParams = z.infer<typeof userValidation.getUser.params>;
type UpdateUserParams = z.infer<typeof userValidation.updateUser.params>;
type UpdateUserBody = z.infer<typeof userValidation.updateUser.body>;
type DeleteUserParams = z.infer<typeof userValidation.deleteUser.params>;

export type {
  RegisterBody,
  LoginBody,
  LogoutBody,
  RefreshTokensBody,
  ForgotPasswordBody,
  ResetPasswordQuery,
  ResetPasswordBody,
  VerifyEmailQuery,
  CreateUserBody,
  GetUsersQuery,
  GetUserParams,
  UpdateUserParams,
  UpdateUserBody,
  DeleteUserParams,
};
