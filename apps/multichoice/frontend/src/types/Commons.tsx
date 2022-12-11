export interface ITopicLocal {
  id: number;
  title: string;
}

export interface ITestRealtimeRecord {
  started: boolean;
  startTime: Date | number;
  duration?: number;
}

export interface IPagination {
  page: number;
  take: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RedirectQuery {
  redirect: string;
}
