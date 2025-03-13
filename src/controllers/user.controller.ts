import userService from '@/services/user.service';
import type { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.createUser(payload);
  res.status(httpStatus.CREATED).send(user);
};

const getUser: RequestHandler = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(httpStatus.OK).send(user);
};

export default {
  createUser,
  getUser,
};
