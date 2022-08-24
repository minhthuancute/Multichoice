import { TopicCategoryEnum } from '@monorepo/multichoice/constant';

type QuestionCategoryType = keyof typeof TopicCategoryEnum;

export interface ITopicResponse {
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: QuestionCategoryType;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questions: [];
}
