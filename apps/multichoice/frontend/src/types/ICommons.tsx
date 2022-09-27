import {
  QuestionTypeEnum,
  TopicCategoryEnum,
} from '@monorepo/multichoice/constant';

export type TopicCategoryType = keyof typeof TopicCategoryEnum;
export type QuestionType = keyof typeof QuestionTypeEnum;

export interface ITopicLocal {
  id: number;
  title: string;
}
