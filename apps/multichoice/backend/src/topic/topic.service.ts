import {
  AddGroupForTopic,
  CreateTopicDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from '@monorepo/multichoice/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository, UpdateResult } from 'typeorm';
import { Topic } from '../question/entities/topic.entity';
import { User } from '../user/entities/user.entity';

import { Question } from '../question/entities/question.entity';
import { GConfig } from '../config/gconfig';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { GroupService } from '../group/group.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly groupService: GroupService
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

  async create(topic: CreateTopicDto, user: User): Promise<Topic> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    topicEntity.owner = user;

    const result = await this.topicRepository.save(topicEntity);
    return result;
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

  async findAllTopics(
    pageOptionsDto: PageOptionsDto,
    user: User
  ): Promise<PageDto<Topic>> {
    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      .where('topic.ownerId = :owner', { owner: user.id })
      .leftJoin('topic.questions', 'questions')
      .loadRelationCountAndMap('topic.questionsCount', 'topic.questions')
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take);
    const { 0: topics, 1: itemCount } = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(topics, pageMetaDto);
  }

  async update(
    id: number,
    topic: CreateTopicDto,
    user: User
  ): Promise<UpdateResult> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    const result = await this.topicRepository.update(
      { id, owner: { id: user.id } },
      topicEntity
    );
    return result;
  }

  async getIsCorrectByTopicID(id: number): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
      },
      relations: ['questions', 'questions.answers'],
    });

    if (!result) throw new BadRequestException(GConfig.TOPIC_NOT_FOUND);

    return this.filterAnswerIsCorrect(result);
  }

  private filterAnswerIsCorrect(topic: Topic): Topic {
    for (let i = 0; i < topic.questions.length; i++) {
      if (topic.questions[i].type.endsWith(QuestionTypeEnum.TEXT)) {
        delete topic.questions[i];
      } else {
        for (let j = 0; j < topic.questions[i].answers.length; j++) {
          if (!topic.questions[i].answers[j].isCorrect) {
            delete topic.questions[i].answers[j];
          }
        }
      }
    }
    return topic;
  }

  async getIsCorrectByUrl(url: string): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        url,
      },
      relations: ['questions', 'questions.answers'],
    });
    if (!result) throw new BadRequestException(GConfig.TOPIC_NOT_FOUND);
    return this.filterAnswerIsCorrect(result);
  }
  async checkPermissionUserOfTopic(
    topicID: number,
    userID: number
  ): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id: topicID,
        groups: { users: { id: userID } },
      },
    });
    if (!result)
      throw new BadRequestException(GConfig.NOT_PERMISSION_EXAM_TOPIC);
    return result;
  }

  async addGroupForTopic(
    query: AddGroupForTopic,
    userID: number
  ): Promise<void> {
    const result = await this.topicRepository.findOne({
      where: {
        id: query.topicID,
        owner: { id: userID },
      },
      relations: ['groups'],
    });
    if (!result)
      throw new BadRequestException(GConfig.NOT_PERMISSION_ADD_GROUP_FOR_TOPIC);

    const group = await this.groupService.findOnebyGroupID(
      query.groupID,
      userID
    );
    if (!group)
      throw new BadRequestException(GConfig.NOT_PERMISSION_ADD_GROUP_FOR_TOPIC);
    result.groups.push(group);
    this.topicRepository.save(result);
  }
}
