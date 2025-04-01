import authService from "@/services/auth.service";
import tokenService from "@/services/token.service";
import userService from "@/services/user.service";
import { ApiError } from "@/utils";
import { hashPassword } from "@/utils/passwordUtils";
import type { Request, Response } from "express";
import httpStatus from "http-status";

const register = async (req: Request, res: Response) => {
  const payload = req.body;

  const existingUser = await userService.getUserByEmail(payload.email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is already taken");
  }

  const hashedPassword = await hashPassword(payload.password);
  const user = await userService.createUser({ ...payload, password: hashedPassword });

  res.status(httpStatus.CREATED).send(user);
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
};

const forgotPassword = async (req: Request, res: Response) => {
  //   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  //   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  //   res.status(httpStatus.NO_CONTENT).send();

  res.send({ message: "OK" });
};

const resetPassword = async (req: Request, res: Response) => {
  //   const updatedUser = await authService.resetPassword(req.query.token, req.body.password);
  //   await emailService.sendPasswordRestSuccessEmail(updatedUser.email);
  //   res.status(httpStatus.NO_CONTENT).send();

  res.send({ message: "OK" });
};

const sendVerificationEmail = async (req: Request, res: Response) => {
  //   const otp = await otpService.generateAndSaveOtp(req.user.id);
  //   await emailService.sendVerificationEmail(req.user.email, otp);
  //   res.status(httpStatus.NO_CONTENT).send();

  res.send({ message: "OK" });
};

const verifyEmail = async (req: Request, res: Response) => {
  //   await otpService.verifyOtp(req.user.id, req.body.otp);
  //   res.status(httpStatus.NO_CONTENT).send();

  res.send({ message: "OK" });
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
