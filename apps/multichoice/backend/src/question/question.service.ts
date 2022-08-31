import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from '@monorepo/multichoice/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { SucessResponse } from '../model/SucessResponse';
import { plainToClass } from 'class-transformer';
import { Topic } from './entities/topic.entity';
import { Answer } from '../answer/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>
  ) {}

  async deleteByID(id: number): Promise<boolean> {
    await this.questionRepository.delete(id);
    return true;
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    topic: Topic,
    files: any
  ): Promise<SucessResponse> {
    const QuestionEntity: Question = plainToClass(Question, createQuestionDto);
    if (
      createQuestionDto.answers == undefined &&
      createQuestionDto.answers.length == 0
    ) {
      throw new BadRequestException('answers is not  empty');
    }
    if (files !== undefined) {
      //save image}||audio
      if (files.audio !== undefined) {
        QuestionEntity.audio = files.audio.filename;
      }
      if (files.image !== undefined) {
        QuestionEntity.image = files.image.filename;
      }
    }

    QuestionEntity.topic = topic;

    // save question
    const saveQuestion = await this.questionRepository.save(QuestionEntity);

    // save list answer
    const answers: Answer[] = createQuestionDto.answers.map((opt) => {
      const questionOption = new Answer();
      questionOption.content = opt.content;
      questionOption.isCorrect = opt.isCorrect;
      questionOption.question = saveQuestion;
      return questionOption;
    });
    await this.answerRepository.save(answers);

    return new SucessResponse(201, 'Sucess');
  }

  async getQestionByID(id: number): Promise<Question> {
    const result = await this.questionRepository.findOne({
      where: { id },
      relations: ['answers'],
    });
    return result;
  }

  convertQuestionEntity(
    files: any,
    updateQuestionDto: UpdateQuestionDto
  ): QuestionEntity {
    const QuestionEntity: Question = new Question();
    QuestionEntity.type = updateQuestionDto.type;
    QuestionEntity.content = updateQuestionDto.content;
    QuestionEntity.time = updateQuestionDto.time;
    QuestionEntity.isActive = updateQuestionDto.isActive;
    if (files !== undefined) {
      //save image}||audio
      if (files.audio !== undefined) {
        QuestionEntity.audio = files.audio.filename;
      }
      if (files.image !== undefined) {
        QuestionEntity.image = files.image.filename;
      }
    }
    return QuestionEntity;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    files: any
  ): Promise<SucessResponse> {
    const question = await this.getQestionByID(id);
    if (!question) throw new BadRequestException('Question is not found');

    const QuestionEntity = this.convertQuestionEntity(files, updateQuestionDto);
    // update question
    await this.questionRepository.update({ id }, QuestionEntity);

    // update list answer
    if (
      updateQuestionDto.answers != undefined &&
      updateQuestionDto.answers.length > 0
    ) {
      const answers = updateQuestionDto.answers.map((opt) => {
        const questionOption = new Answer();
        questionOption.content = opt.content;
        questionOption.isCorrect = opt.isCorrect;
        return this.answerRepository.update({ id: opt.id }, questionOption);
      });
      await Promise.all(answers);
    }

    return new SucessResponse(200, 'Sucess');
  }
}
