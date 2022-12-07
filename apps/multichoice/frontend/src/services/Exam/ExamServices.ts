import { IAnswers } from '../../store/rootReducer';
import { axiosClient } from '../Api';
import {
  IPayloadDeleteUserExam,
  IPayloadEndExam,
  IPayloadEndExamRealtime,
  IPayloadgetListExamByTopicId,
  IPayloadGetUserExamDetail,
  IPayloadStartExam,
} from './type';

export const examServices = {
  getExamByUrl(url: string) {
    return axiosClient.get('/gettopicbyurl?url=' + url);
  },

  startExam(payload: IPayloadStartExam) {
    return axiosClient.post('/exam/start', payload);
  },

  submitExam(payload: IPayloadEndExam) {
    return axiosClient.post('/exam/end', payload);
  },

  async submitExamRealtime(payload: IPayloadEndExamRealtime) {
    const { data } = await axiosClient.post('/examrealtime/end', payload);
    return data;
  },

  async getListExamByTopicId(payload: IPayloadgetListExamByTopicId) {
    const { data } = await axiosClient.get(
      '/getListexambytopicid/' + payload.topicID
    );
    return data;
  },

  getUserExamDetail(payload: IPayloadGetUserExamDetail) {
    const data = axiosClient.get(
      `/userexam/getdetail?topicID=${payload.topicId}&userID=${payload.userId}`
    );
    return data;
  },

  deleteUserExam(payload: IPayloadDeleteUserExam) {
    const data = axiosClient.delete(
      `/userexam/deletebyid?id=${payload.userId}`
    );
    return data;
  },
};
