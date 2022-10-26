import { CreateTopicDto } from '@monorepo/multichoice/dto';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { SucessResponse } from '../model/SucessResponse';
import { Topic } from '../question/entities/topic.entity';
import { User } from '../user/entities/user.entity';

import { Question } from '../question/entities/question.entity';
import { UserService } from '../user/user.service';
import { GConfig } from '../config/gconfig';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @Inject(forwardRef(() => UserService))
    private readonly userExamService: UserService
  ) {}

  deleteCorrect(questions: Question[]) {
    if (questions) {
      questions.map((x) => {
        x.answers.map((a) => {
          delete a.isCorrect;
          return a;
        });
        return x;
      });
    }
  }

  async create(topic: CreateTopicDto, user: User): Promise<SucessResponse> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    topicEntity.owner = user;

    const result = await this.topicRepository.save(topicEntity);
    return new SucessResponse(201, result);
  }

  async fineOneByID(id: number): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
      },
      relations: ['questions', 'questions.answers'],
    });
    if (!result) {
      throw new NotFoundException(GConfig.TOPIC_NOT_FOUND);
    }
    this.deleteCorrect(result.questions);
    return result;
  }

  async getTopicByID(id: number, user: User): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
      },
      relations: ['questions', 'questions.answers'],
    });
    if (!result) {
      throw new NotFoundException(GConfig.TOPIC_NOT_FOUND);
    }
    if (!(await this.checkAuth(id, user)))
      throw new BadRequestException(GConfig.NOT_PERMISSION_VIEW);
    return result;
  }

  async findOneByUrl(url: string): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        url,
      },
      relations: ['questions', 'questions.answers'],
    });

    if (!result) throw new BadRequestException(GConfig.TOPIC_NOT_FOUND);
    this.deleteCorrect(result.questions);
    return result;
  }

  async checkAuth(id: number, user: User): Promise<boolean> {
    const topic = await this.topicRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });
    if (topic && topic.owner.id === user.id) return true;

    return false;
  }

  async deleteById(id: number, user: User): Promise<boolean> {
    if (!(await this.checkAuth(id, user)))
      throw new BadRequestException(GConfig.NOT_PERMISSION_DELETE);
    await this.topicRepository.delete(id);
    return true;
  }

  async findAllTopics(user: User): Promise<Topic[]> {
    const result = await this.topicRepository
      .createQueryBuilder('topic')
      .where('topic.ownerId = :owner', { owner: user.id })
      .leftJoin('topic.questions', 'questions')
      .loadRelationCountAndMap('topic.questionsCount', 'topic.questions')
      .getMany();
    return result;
  }

  async update(
    id: number,
    topic: CreateTopicDto,
    user: User
  ): Promise<SucessResponse> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    const result = await this.topicRepository.update(
      { id, owner: user },
      topicEntity
    );
    return new SucessResponse(200, result);
  }

  async getIsCorrectByTopicID(id: number): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
        questions: {
          answers: {
            isCorrect: true,
          },
        },
      },
      relations: ['questions', 'questions.answers'],
    });
    return result;
  }

  async getIsCorrectByUrl(url: string): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        url,
        questions: {
          answers: {
            isCorrect: true,
          },
        },
      },
      relations: ['questions', 'questions.answers'],
    });
    return result;
  }
}
