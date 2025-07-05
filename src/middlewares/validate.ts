import { ApiError, pick } from '@/utils';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import type { ZodObject, ZodTypeAny } from 'zod';

type SchemaObject = {
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
};

const validate = (schema: SchemaObject) => (req: Request, _res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);

  for (const key of Object.keys(validSchema) as (keyof SchemaObject)[]) {
    // biome-ignore lint/suspicious/noExplicitAny:
    const zodSchema = validSchema[key] as ZodObject<any>;
    const result = zodSchema.strict().safeParse(object[key]);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => (issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
        .join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
  }

  next();
};

export default validate;
