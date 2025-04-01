import { env } from "@/config";
import { tokenTypes } from "@/config/tokens";
import db from "@/db";
import { tokens } from "@/db/schema";
import type { User } from "@/types";
import { ApiError } from "@/utils";
import { and, eq } from "drizzle-orm";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import moment from "moment";
import userService from "./user.service";

type TokenPayload = typeof tokens.$inferInsert;

const generateToken = (userId: string, expires: moment.Moment, type: string, secret = env.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (data: TokenPayload) => {
  // TODO: Handling expires field storage, accepting time
  const tokenDoc = await db.insert(tokens).values(data).returning();

  return tokenDoc[0];
};

const getToken = async (token: string) => {
  const tokenDoc = await db.select().from(tokens).where(eq(tokens.token, token)).limit(1).execute();
  return tokenDoc[0] || null;
};

const deleteToken = async (userId: string, type: string) => {
  await db
    .delete(tokens)
    .where(and(eq(tokens.userId, userId), eq(tokens.type, type)))
    .execute();
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, env.jwt.secret);

  const tokenDoc = await db
    .select()
    .from(tokens)
    .where(
      and(
        eq(tokens.token, token),
        eq(tokens.type, type),
        eq(tokens.userId, payload.sub as string),
        eq(tokens.blacklisted, false),
      ),
    );

  if (!tokenDoc || tokenDoc.length === 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Token not found or is blacklisted");
  }

  return tokenDoc[0];
};

const generateAuthTokens = async (user: User) => {
  const accessTokenExpires = moment().add(env.jwt.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(env.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

  await saveToken({
    token: refreshToken,
    userId: user.id,
    expires: refreshTokenExpires.format("YYYY-MM-DD"),
    type: tokenTypes.REFRESH,
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found with this email");
  }
  const expires = moment().add(env.jwt.resetPasswordExpirationMinutes, "minutes");
  const token = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);

  const tokenPayload = {
    token,
    expires: expires.format("YYYY-MM-DD"),
    userId: user.id,
    type: tokenTypes.RESET_PASSWORD,
  };

  await saveToken(tokenPayload);
  return token;
};

const generateVerifyEmailToken = async (user: User) => {
  const expires = moment().add(env.jwt.verifyEmailExpirationMinutes, "minutes");
  const token = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);

  const tokenPayload = {
    token,
    expires: expires.format("YYYY-MM-DD"),
    userId: user.id,
    type: tokenTypes.VERIFY_EMAIL,
  };
  await saveToken(tokenPayload);
  return token;
};

export default {
  getToken,
  deleteToken,
  generateToken,
  verifyToken,
  saveToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
