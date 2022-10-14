import {
  QuestionTypeEnum,
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';

export type TopicCategoryType = keyof typeof TopicCategoryEnum;
export type QuestionType = keyof typeof QuestionTypeEnum;
export type TimeType = keyof typeof TopicTimeTypeEnum;

export interface ITopicLocal {
  id: number;
  title: string;
}

export interface ITestRealtimeRecord {
  start: boolean;
  time: Date | number;
}
