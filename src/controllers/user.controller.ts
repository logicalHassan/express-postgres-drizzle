import userService from '@/services/user.service';
import type { RequestHandler } from 'express';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req, res) => {
  const payload = req.body;
  const user = await userService.createUser(payload);
  res.status(httpStatus.CREATED).send(user);
};

const getAllUsers: RequestHandler = async (_req, res) => {
  const users = await userService.getAllUsers();
  res.status(httpStatus.OK).send(users);
};

const getUser: RequestHandler = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(httpStatus.OK).send(user);
};

export default {
  getAllUsers,
  createUser,
  getUser,
};
