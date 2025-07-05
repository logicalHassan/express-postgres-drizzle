import userService from '@/services/user.service';
import type { GetUsersQuery } from '@/types/validation.types';
import { pick } from '@/utils';
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
  const query = req.query as GetUsersQuery;
  const options = pick(query, ['page', 'limit', 'sortBy', 'order']);
  const filters = pick(query, ['role', 'name']);

  const result = await userService.queryUsers(options, filters);
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
