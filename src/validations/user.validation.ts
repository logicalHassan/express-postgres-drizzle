import { rolesAllowed } from '@/config';
import Joi from 'joi';
import { objectId, password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid(...rolesAllowed),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    limit: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(1).default(1),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
