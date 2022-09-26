import {
  QuestionTypeEnum,
  TopicCategoryEnum,
} from '@monorepo/multichoice/constant';

export type TopicCategoryType = keyof typeof TopicCategoryEnum;
export type QuestionType = keyof typeof QuestionTypeEnum;
