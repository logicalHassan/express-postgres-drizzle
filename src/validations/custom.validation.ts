import { z } from 'zod';

export const isPassword = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
    message: 'Password must contain at least 1 letter and 1 number',
  });
