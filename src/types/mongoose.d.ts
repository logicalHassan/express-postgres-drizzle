import { Document, Model } from "mongoose";
import { PaginateOptions, PaginateResult } from ".";

declare module "mongoose" {
  interface Model<T extends Document> {
    paginate?(filter: Partial<T>, options: PaginateOptions): Promise<PaginateResult<T>>;
  }
}
