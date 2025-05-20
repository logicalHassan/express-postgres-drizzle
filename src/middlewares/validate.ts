import { ApiError, pick } from '@/utils';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { type ObjectSchema } from 'joi';

type SchemaObject = {
  params?: ObjectSchema;
  query?: ObjectSchema;
  body?: ObjectSchema;
};

const validate = (schema: SchemaObject) => (req: Request, _res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
