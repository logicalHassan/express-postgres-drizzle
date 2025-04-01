import { User } from "@/types";
import { ApiError } from "@/utils";
import { isPasswordMatch } from "@/utils/passwordUtils";
import httpStatus from "http-status";
import userService from "./user.service";

const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await isPasswordMatch(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

export default {
  loginUserWithEmailAndPassword,
};
