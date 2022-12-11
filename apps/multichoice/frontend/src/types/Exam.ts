import { IQuestion } from './Topic';
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
