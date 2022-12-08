import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { axiosClient } from '../Api';

export const questionServices = {
  createQuestion(formData: CreateQuestionDto) {
    return axiosClient.post('/question/create', formData);
  },

  updateQuestion(questionId: number, formData: CreateQuestionDto) {
    return axiosClient.patch('/question/' + questionId, formData);
  },

  deleteQuestion(questionId: number) {
    return axiosClient.delete('/question/' + questionId);
  },
};
