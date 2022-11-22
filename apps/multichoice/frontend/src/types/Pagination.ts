export interface IPagination {
  page: number;
  take: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
