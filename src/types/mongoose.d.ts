import { type Document, Model } from "mongoose";
import type { PaginateOptions, PaginateResult } from ".";

declare module "mongoose" {
  interface Model<T extends Document> {
    paginate?(filter: Partial<T>, options: PaginateOptions): Promise<PaginateResult<T>>;
  }
}
