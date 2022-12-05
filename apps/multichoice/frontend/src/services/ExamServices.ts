import { IAnswers } from '../store/rootReducer';
import { Api } from './Api';

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

class ExamServices extends Api {
  getExamByUrl(url: string) {
    const data = this.get('/gettopicbyurl?url=' + url);
    return data;
  }

  startExam(payload: IPayloadStartExam) {
    const data = this.post('/exam/start', payload);
    return data;
  }

  submitExam(payload: IPayloadEndExam) {
    const data = this.post('/exam/end', payload);
    return data;
  }

  async submitExamRealtime(payload: IPayloadEndExamRealtime) {
    const { data } = await this.post('/examrealtime/end', payload);
    return data;
  }

  async getListExamByTopicId(payload: IPayloadgetListExamByTopicId) {
    const { data } = await this.get('/getListexambytopicid/' + payload.topicID);
    return data;
  }

  getUserExamDetail(payload: IPayloadGetUserExamDetail) {
    const data = this.get(
      `/userexam/getdetail?topicID=${payload.topicId}&userID=${payload.userId}`
    );
    return data;
  }

  deleteUserExam(payload: IPayloadDeleteUserExam) {
    const data = this.delete(`/userexam/deletebyid?id=${payload.userId}`);
    return data;
  }
}

export const examServices = new ExamServices();
