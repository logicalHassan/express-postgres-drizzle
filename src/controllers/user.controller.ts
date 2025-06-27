import userService from '@/services/user.service';
import type { RequestHandler } from 'express';
import httpStatus from 'http-status';

const createUser: RequestHandler = async (req, res) => {
  const payload = req.body;
  const user = await userService.createUser(payload);
  res.status(httpStatus.CREATED).send(user);
};

const getUser: RequestHandler = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.status(httpStatus.OK).send(user);
};

export const getUsers: RequestHandler = async (req, res) => {
  const query = req.query as Record<string, any>;

  const { page, limit, sortBy, order, ...filters } = query;

  const offset = (page - 1) * limit;

  const pagination = {
    limit,
    offset,
    sortBy,
    order,
  };

  const result = await userService.queryUsers({ pagination, filters });

  res.send(result);
};

const updateUser: RequestHandler = async (req, res) => {
  const user = await userService.updateUser(req.params.userId, req.body);
  res.send(user);
};

const deleteUser: RequestHandler = async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
