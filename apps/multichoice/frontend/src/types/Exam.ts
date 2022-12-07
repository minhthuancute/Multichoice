import { IQuestion } from './TopicResponse';
export interface IExam {
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: string;
  timeType: string;
  title: string;
  url: string;
  description: string;
  isDraft: boolean;
  expirationTime: string;
  questions: IQuestion[];
}

export interface IExamDetail {
  createdAt: string;
  updatedAt: string;
  id: number;
  typeCategoryName: string;
  timeType: string;
  title: string;
  url: string;
  description: string;
  isDraft: boolean;
  expirationTime: string;
}
