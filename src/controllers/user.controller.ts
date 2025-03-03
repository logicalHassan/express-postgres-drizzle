import userService from "@/services/user.service";
import type { Request, Response } from "express";
import httpStatus from "http-status";

const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(httpStatus.OK).send(user);
};

export default {
  getUser,
};
