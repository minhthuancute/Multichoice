export interface ITopicLocal {
  id: number;
  title: string;
}

export interface ITestRealtimeRecord {
  started: boolean;
  startTime: Date | number;
  duration?: number;
}
