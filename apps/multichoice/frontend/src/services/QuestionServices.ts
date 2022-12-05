import { CreateQuestionDto } from '@monorepo/multichoice/dto';
import { Api } from './Api';

class QuestionServices extends Api {
  createQuestion(formData: CreateQuestionDto) {
    return this.post('/question/create', formData);
  }

  updateQuestion(questionId: number, formData: CreateQuestionDto) {
    return this.update('/question/' + questionId, formData);
  }

  deleteQuestion(questionId: number) {
    return this.delete('/question/' + questionId);
  }
}

export const questionServices = new QuestionServices();
