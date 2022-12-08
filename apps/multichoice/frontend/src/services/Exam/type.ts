import { IAnswers } from '../../store/rootReducer';

export interface IPayloadStartExam {
  userName: string;
  topicID: number;
}

export interface IPayloadEndExam {
  userID: number;
  answerUsers: IAnswers[];
}

export interface IPayloadEndExamRealtime {
  userID: number;
  url: string;
  answerUsers: IAnswers[];
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
