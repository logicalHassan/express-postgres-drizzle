import { env } from "@/config";
import { logger } from "@/config/logger";
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, VERIFICATION_EMAIL } from "@/utils/emailTemplates";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport(env.email.smtp);
if (env.mode !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn("Unable to connect to email server. Make sure you have configured the SMTP options in .env"),
    );
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = { from: env.email.from, to, subject, html };
  await transport.sendMail(msg);
};

//* Send reset password email
const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  const resetPasswordUrl = `${env.frontend.url}/reset-password?token=${token}`;
  const html = PASSWORD_RESET_REQUEST(resetPasswordUrl);
  await sendEmail(to, subject, html);
};

//* Notify the user of a successful password reset
const sendPasswordRestSuccessEmail = async (to: string) => {
  const subject = "Password reset successful";
  const html = PASSWORD_RESET_SUCCESS;
  await sendEmail(to, subject, html);
};

//* Send verification email
const sendVerificationEmail = async (to: string, otp: string) => {
  const subject = "Email Verification";
  const html = VERIFICATION_EMAIL(otp);
  await sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendResetPasswordEmail,
  sendPasswordRestSuccessEmail,
  sendVerificationEmail,
};
