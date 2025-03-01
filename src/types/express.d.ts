import type { Request } from "express";
import { User } from ".";

declare module "express" {
  export interface Request {
    user?: User;
  }
}
