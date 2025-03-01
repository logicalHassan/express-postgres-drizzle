import { Request, Response } from "express";

const login = async (req: Request, res: Response) => {
  req.user;
  //   const { email, password } = req.body;
  //   const user = await authService.loginUserWithEmailAndPassword(email, password);
  //   const token = await tokenService.generateAuthToken(user);
  //   res.send({ user, token });

  res.send({ message: "OK" });
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
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
