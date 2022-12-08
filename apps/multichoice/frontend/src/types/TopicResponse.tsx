import {
  QuestionTypeEnum,
  TopicCategoryEnum,
} from '@monorepo/multichoice/constant';

export interface IAnswer {
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

export interface ITopic {
  url: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: TopicCategoryEnum;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questionsCount: number;
  questions: IQuestion[];
}
