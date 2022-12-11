import { IAnswer } from '../../store/rootReducer';

export interface IPayloadStartExam {
  userName: string;
  topicID: number;
}

export interface IPayloadEndExam {
  url: string;
  userID: number | null;
  answerUsers: IAnswer[];
}

export interface IPayloadgetListExamByTopicId {
  topicID: number;
}

export interface IPayloadGetUserExamDetail {
  topicId: number;
  userId: number;
}

export interface IPayloadDeleteUserExam {
  userId: number;
}
