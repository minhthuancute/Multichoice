import { IAnswers } from '../store/rootReducer';
import { Api } from './Api';

export interface IPayloadStartExam {
  username: string;
  topicID: number;
}

export interface IPayloadEndExam {
  userID: number;
  AnswersUsers: IAnswers[];
}

class ExamServices extends Api {
  getExamInfor(examUrl: string) {
    const data = this.get('/' + examUrl);
    return data;
  }

  startExam(payload: IPayloadStartExam) {
    const data = this.post('/exam/start', payload);
    return data;
  }

  // end Exam
  submitExam(payload: IPayloadEndExam) {
    const data = this.post('/exam/end', payload);
    return data;
  }
}

export const examServices = new ExamServices();
