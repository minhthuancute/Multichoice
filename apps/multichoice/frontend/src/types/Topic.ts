import {
  QuestionTypeEnum,
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { UpdateAnswer } from '@monorepo/multichoice/dto';

export interface IQuestion {
  id: number;
  content: string;
  isActive: boolean;
  time: number;
  image: string;
  audio: string;
  type: QuestionTypeEnum;
  answers: UpdateAnswer[];
}

export interface ITopic {
  url: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: TopicCategoryEnum;
  timeType: TopicTimeTypeEnum;
  title: string;
  description: string | null;
  isDraft: boolean;
  isPublic: boolean;
  expirationTime: number;
  questionsCount: number;
  questions: IQuestion[];
}

export interface ITokenPayload {
  email: string;
  exp: number;
  iat: number;
  id: number;
  username: string;
}
