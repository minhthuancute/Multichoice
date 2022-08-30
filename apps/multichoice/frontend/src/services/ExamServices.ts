import { Api } from './Api';

export interface IPayloadStartExam {
  username: string;
  topicID: number;
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
}

export const examServices = new ExamServices();
