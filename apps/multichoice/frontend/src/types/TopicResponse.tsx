import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { TopicCategoryType } from './ICommons';

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

export interface ITopicResponse {
  url: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: TopicCategoryType;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questionsCount: number;
}

export interface ITopicDetailResponse {
  url: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: TopicCategoryType;
  timeType: string;
  title: string;
  description: string | null;
  isDraft: boolean;
  expirationTime: number;
  questions: IQuestion[];
}
