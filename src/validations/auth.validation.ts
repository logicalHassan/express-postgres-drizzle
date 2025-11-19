import { strictZod as z } from '@/utils/strict-zod';
import { isPassword } from './custom.validation';

const register = {
  body: z.object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(20, { message: 'Name must be at most 20 characters long' }),
    email: z.string().email(),
    password: isPassword,
  }),
};

const login = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

const logout = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const refreshTokens = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const forgotPassword = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPassword = {
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: isPassword,
  }),
};

const verifyEmail = {
  query: z.object({
    token: z.string(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
