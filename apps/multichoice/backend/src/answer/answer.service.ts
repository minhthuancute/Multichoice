import { CreatAnswer, UpdateAnswer } from '@monorepo/multichoice/dto';
import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { Question } from '../question/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>
  ) {}

  create(createAnswerDto: CreateAnswerDto) {
    return 'This action adds a new answer';
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} answer`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }

  public async saveListAnswerforQuestion(
    createAnswerDto: CreatAnswer[],
    question: Question
  ): Promise<void> {
    if (createAnswerDto) {
      const answers: Answer[] = createAnswerDto.map((opt) => {
        const questionOption = new Answer();
        questionOption.content = opt.content;
        questionOption.isCorrect = opt.isCorrect;
        questionOption.question = question;
        return questionOption;
      });
      await this.answerRepository.save(answers);
    }
  }

  public async updateListAnswerforQuestion(
    question: Question,
    updateAnswersDto: UpdateAnswer[]
  ): Promise<void> {
    const listIdAnswer: number[] = question.answers.map((x) => {
      return x.id;
    });
    if (updateAnswersDto && updateAnswersDto.length) {
      updateAnswersDto.forEach((opt) => {
        const questionOption = new Answer();
        questionOption.content = opt.content;
        questionOption.isCorrect = opt.isCorrect;
        const answerID = opt.id;
        if (!answerID) {
          questionOption.question = question;
          this.answerRepository.insert(questionOption);
        } else {
          if (listIdAnswer.includes(answerID)) {
            this.answerRepository.update({ id: answerID }, questionOption);
            listIdAnswer.splice(listIdAnswer.indexOf(answerID), 1);
          }
        }
      });
    }

    if (listIdAnswer.length) {
      await this.answerRepository.delete(listIdAnswer);
    }
  }
}
