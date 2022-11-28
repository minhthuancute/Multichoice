import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from '@monorepo/multichoice/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { TopicService } from '../topic/topic.service';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { GConfig } from '../config/gconfig';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly topicService: TopicService,
    private readonly answerService: AnswerService
  ) {}

  public async deleteByID(id: number, userID: number): Promise<void> {
    if (await this.checkOwnerQuestion(id, userID)) {
      await this.questionRepository.delete(id);
    } else {
      throw new BadRequestException(GConfig.NOT_PERMISSION);
    }
  }

  public async create(
    createQuestionDto: CreateQuestionDto,
    files: any,
    userID: number
  ): Promise<void> {
    const checkTopic = await this.topicService.getTopicByIdAndUserId(
      createQuestionDto.topicID,
      userID
    );

    const questionEntity: Question = plainToClass(Question, createQuestionDto);
    if (
      createQuestionDto.type !== QuestionTypeEnum.TEXT &&
      (!createQuestionDto.answers || !createQuestionDto.answers.length)
    ) {
      throw new BadRequestException(GConfig.ANSWERS_NOT_EMPTY);
    }
    if (files) {
      //save image}||audio
      if (files.audio) {
        questionEntity.audio = files.audio.filename;
      }
      if (files.image) {
        questionEntity.image = files.image.filename;
      }
    }

    questionEntity.topic = checkTopic;

    const saveQuestion = await this.questionRepository.save(questionEntity);

    if (createQuestionDto.type !== QuestionTypeEnum.TEXT) {
      await this.answerService.saveListAnswerforQuestion(
        createQuestionDto.answers,
        saveQuestion
      );
    }
  }

  public async getQestionByID(id: number, userID: number): Promise<Question> {
    const result = await this.questionRepository.findOne({
      where: { id, topic: { owner: { id: userID } } },
      relations: ['answers'],
    });
    if (!result) throw new BadRequestException(GConfig.NOT_PERMISSION);
    return result;
  }

  private async checkOwnerQuestion(
    id: number,
    userID: number
  ): Promise<boolean> {
    if (
      await this.questionRepository.findOne({
        where: { id: id, topic: { owner: { id: userID } } },
      })
    )
      return true;
    return false;
  }

  private convertQuestionEntity(
    files: any,
    updateQuestionDto: UpdateQuestionDto
  ): Question {
    const QuestionEntity: Question = new Question();
    QuestionEntity.type = updateQuestionDto.type;
    QuestionEntity.content = updateQuestionDto.content;
    QuestionEntity.time = updateQuestionDto.time;
    QuestionEntity.isActive = updateQuestionDto.isActive;
    if (files) {
      //save image}||audio
      if (files.audio) {
        QuestionEntity.audio = files.audio.filename;
      }
      if (files.image) {
        QuestionEntity.image = files.image.filename;
      }
    }
    return QuestionEntity;
  }

  public async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    files: any,
    userID: number
  ): Promise<void> {
    const question = await this.getQestionByID(id, userID);

    const QuestionEntity = this.convertQuestionEntity(files, updateQuestionDto);
    await this.questionRepository.update({ id }, QuestionEntity);

    await this.answerService.updateListAnswerforQuestion(
      question,
      updateQuestionDto.answers
    );
  }
}
