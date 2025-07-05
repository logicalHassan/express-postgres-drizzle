import db from '@/db';
import type { PaginateParams, PaginatedResult } from '@/types';
import { and, asc, desc, getTableColumns, sql } from 'drizzle-orm';

// biome-ignore lint/suspicious/noExplicitAny:
export async function paginate<T>(params: PaginateParams<any>): Promise<PaginatedResult<T>> {
  const { table, filters = [], options = {} } = params;

  const limit = options.limit && Number.parseInt(options.limit, 10) > 0 ? Number.parseInt(options.limit, 10) : 10;
  const page = options.page && Number.parseInt(options.page, 10) > 0 ? Number.parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const allColumns = getTableColumns(table);
  const sortColumn =
    options.sortBy && options.sortBy in allColumns
      ? allColumns[options.sortBy as keyof typeof allColumns]
      : table.createdAt;

  const orderBy = options.order === 'asc' ? asc(sortColumn) : desc(sortColumn);
  const results = await db.select().from(table).where(whereClause).orderBy(orderBy).limit(limit).offset(skip);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(table).where(whereClause);

  const totalResults = Number(count);
  const totalPages = Math.ceil(totalResults / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  return {
    results,
    page: currentPage,
    limit,
    totalPages,
    totalResults,
  };
}
