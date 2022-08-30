import {
  QuestionTypeEnum,
  TopicCategoryEnum,
} from '@monorepo/multichoice/constant';

type QuestionCategoryType = keyof typeof TopicCategoryEnum;

interface IAnswer {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: number;
  content: string;
  isActive: boolean;
  time: number;
  image: string;
  audio: string;
  type: QuestionTypeEnum;
  answers: IAnswer[];
}

export interface ITopicResponse {
  url: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: QuestionCategoryType;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questions: IQuestion[];
}
