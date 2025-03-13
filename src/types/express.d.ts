import type { Request } from 'express';
import type { User } from '.';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
