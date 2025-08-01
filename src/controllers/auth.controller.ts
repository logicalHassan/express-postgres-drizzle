import authService from '@/services/auth.service';
import emailService from '@/services/email.service';
import tokenService from '@/services/token.service';
import userService from '@/services/user.service';
import type { AuthedReq } from '@/types';
import type { LoginBody, RegisterBody } from '@/types/validation.types';
import type { RequestHandler } from 'express';
import httpStatus from 'http-status';

const register: RequestHandler = async (req, res) => {
  const payload = req.body as RegisterBody;
  const user = await userService.createUser(payload);
  res.status(httpStatus.CREATED).send(user);
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as LoginBody;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
};

const logout: RequestHandler = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({ success: true, message: 'User logout successfully!' });
};

const forgotPassword: RequestHandler = async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens: RequestHandler = async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
};

const resetPassword: RequestHandler = async (req, res) => {
  const { token } = req.query;

  await authService.resetPassword(token as string, req.body.password);
  res.status(httpStatus.OK).send({ success: true, message: 'Password Reset Successfully!' });
};

const sendVerificationEmail: RequestHandler = async (req, res) => {
  const user = (req as AuthedReq).user;
  const { email, isEmailVerified } = user;

  if (isEmailVerified) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: `Email: ${email} is already activated!`,
    });
  }

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(httpStatus.OK).send({
    success: true,
    message: `Email sent to ${email} successfully!`,
  });
};

const verifyEmail: RequestHandler = async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Email: Verified successfully!',
  });
};

export default {
  register,
  logout,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
};
