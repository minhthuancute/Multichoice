import { axiosClient } from '../Api';
import {
  IPayloadDeleteUserExam,
  IPayloadEndExam,
  IPayloadgetListExamByTopicId,
  IPayloadGetUserExamDetail,
  IPayloadStartExam,
} from './type';

export const examServices = {
  getExamByUrl(url: string) {
    const data = axiosClient.get('/topic/url?q=' + url);
    return data;
  },

  startExam(payload: IPayloadStartExam) {
    const data = axiosClient.post('/exam/start', payload);
    return data;
  },

  submitExam(payload: IPayloadEndExam) {
    const data = axiosClient.post('/exam/end', payload);
    return data;
  },

  async submitExamRealtime(payload: IPayloadEndExam) {
    const data = await axiosClient.post('/exam-realtime/end', payload);
    return data;
  },

  async getListExamByTopicId(payload: IPayloadgetListExamByTopicId) {
    const data = await axiosClient.get(`/topic/${payload.topicID}/exams/`);
    return data;
  },

  getUserExamDetail(payload: IPayloadGetUserExamDetail) {
    const data = axiosClient.get(
      `/exam/detail?topicID=${payload.topicId}&userID=${payload.userId}`
    );
    return data;
  },

  deleteUserExam(payload: IPayloadDeleteUserExam) {
    const data = axiosClient.delete(`/exam/${payload.userId}`);
    return data;
  },
};
