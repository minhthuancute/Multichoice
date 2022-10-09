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
import { Answer } from '../answer/entities/answer.entity';
import { TopicService } from '../topic/topic.service';
import { User } from '../user/entities/user.entity';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { GConfig } from '../config/gconfig';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly topicService: TopicService
  ) {}

  async deleteByID(id: number): Promise<boolean> {
    await this.questionRepository.delete(id);
    return true;
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    files: any
  ): Promise<SucessResponse> {
    const checkTopic = await this.topicService.fineOneByID(
      createQuestionDto.topicID
    );

    const questionEntity: Question = plainToClass(Question, createQuestionDto);
    if (
      createQuestionDto.type !== QuestionTypeEnum.TEXT &&
      (createQuestionDto.answers == undefined ||
        createQuestionDto.answers.length == 0)
    ) {
      throw new BadRequestException(GConfig.ANSWERS_NOT_EMPTY);
    }
    if (files !== undefined) {
      //save image}||audio
      if (files.audio !== undefined) {
        questionEntity.audio = files.audio.filename;
      }
      if (files.image !== undefined) {
        questionEntity.image = files.image.filename;
      }
    }

    questionEntity.topic = checkTopic;

    // save question
    const saveQuestion = await this.questionRepository.save(questionEntity);

    // save list answer
    if (
      createQuestionDto.answers != undefined &&
      createQuestionDto.type !== QuestionTypeEnum.TEXT
    ) {
      const answers: Answer[] = createQuestionDto.answers.map((opt) => {
        const questionOption = new Answer();
        questionOption.content = opt.content;
        questionOption.isCorrect = opt.isCorrect;
        questionOption.question = saveQuestion;
        return questionOption;
      });
      await this.answerRepository.save(answers);
    }

    return new SucessResponse(201, GConfig.SUCESS);
  }

  //lay day du thong tin question
  async getFullQuestionByID(id: number): Promise<Question> {
    const result = await this.questionRepository.findOne({
      where: { id },
      relations: ['topic.owner', 'answers'],
    });
    return result;
  }

  async getQestionByID(id: number, user: User): Promise<Question> {
    const question = await this.getFullQuestionByID(id);
    if (question) {
      if (!this.checkOwnerQuestion(question.topic.owner.id, user.id)) {
        if (question.answers != null) {
          question.answers.map((x) => {
            delete x.isCorrect;
            return x;
          });
        }
      }
      delete question.topic;
    }
    return question;
  }

  checkOwnerQuestion(id: number, userID: number): boolean {
    if (id === userID) return true;
    return false;
  }

  convertQuestionEntity(
    files: any,
    updateQuestionDto: UpdateQuestionDto
  ): Question {
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

  getAnswers(lst: Answer[]): number[] {
    return lst.map((x) => {
      return x.id;
    });
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    files: any,
    user: User
  ): Promise<SucessResponse> {
    const question = await this.getFullQuestionByID(id);
    if (!question) throw new BadRequestException(GConfig.QUESTION_NOT_FOUND);

    if (!this.checkOwnerQuestion(user.id, question.topic.owner.id))
      throw new BadRequestException(GConfig.NOT_PERMISSION_EDIT);

    const QuestionEntity = this.convertQuestionEntity(files, updateQuestionDto);
    await this.questionRepository.update({ id }, QuestionEntity);

    // lay ds questionOption dc phep
    const check = this.getAnswers(question.answers);
    if (
      updateQuestionDto.answers != undefined &&
      updateQuestionDto.answers.length > 0
    ) {
      updateQuestionDto.answers.forEach((opt) => {
        const questionOption = new Answer();
        questionOption.content = opt.content;
        questionOption.isCorrect = opt.isCorrect;
        if (!opt.id) {
          questionOption.question = question;
          this.answerRepository.insert(questionOption);
        } else {
          if (check.includes(opt.id)) {
            this.answerRepository.update({ id: opt.id }, questionOption);
            check.splice(check.indexOf(opt.id), 1);
          }
        }
      });
    }

    if (check.length !== 0) {
      await this.answerRepository.delete(check);
    }

    return new SucessResponse(200, GConfig.SUCESS);
  }
}
