export interface PaginateOptions {
  limit?: string;
  page?: string;
  sortBy?: string;
  populate?: string;
}

export interface PaginateResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
}
