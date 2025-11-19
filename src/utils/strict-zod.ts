import { z as baseZ } from 'zod';

export const strictZod = {
  ...baseZ,

  /**
   * Creates a Zod object schema that automatically rejects unknown keys.
   * Equivalent to calling:
   *    z.object({...}).strict()
   */
  object: <T extends baseZ.ZodRawShape>(shape: T) => baseZ.object(shape).strict(),
};
