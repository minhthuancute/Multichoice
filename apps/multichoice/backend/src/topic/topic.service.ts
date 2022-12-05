import {
  AddGroupForTopic,
  CreateTopicDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  QueryTopicDto,
} from '@monorepo/multichoice/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Topic } from './entities/topic.entity';
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

  public async create(topic: CreateTopicDto, userID: number): Promise<Topic> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    topicEntity.owner = new User(userID);

    return await this.topicRepository.save(topicEntity);
  }

  public async fineOneByID(id: number): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      throw new NotFoundException(GConfig.TOPIC_NOT_FOUND);
    }
    return result;
  }

  public async getTopicByIdAndUserId(
    id: number,
    userID: number
  ): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        id,
        owner: { id: userID },
      },
      relations: ['questions', 'questions.answers'],
    });
    if (!result) {
      throw new BadRequestException(GConfig.NOT_PERMISSION);
    }
    return result;
  }

  public async findOneByUrl(url: string): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        url,
      },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        description: true,
        expirationTime: true,
        groups: true,
        isPublic: true,
        timeType: true,
        title: true,
        typeCategoryName: true,
        url: true,
        questions: {
          id: true,
          content: true,
          time: true,
          image: true,
          audio: true,
          type: true,
          answers: { id: true, content: true },
        },
      },
    });

    if (!result) throw new BadRequestException(GConfig.TOPIC_NOT_FOUND);
    return result;
  }

  public async deleteById(id: number, userID: number): Promise<void> {
    await this.topicRepository.delete({ id: id, owner: { id: userID } });
  }

  async findAllTopics(
    queryTopicDto: QueryTopicDto,
    userID: number
  ): Promise<PageDto<Topic>> {
    const page = queryTopicDto?.page || 1;
    const take = queryTopicDto?.take || 10;
    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      .where('topic.ownerId = :owner', { owner: userID })
      .leftJoin('topic.questions', 'questions')
      .loadRelationCountAndMap('topic.questionsCount', 'topic.questions')
      .skip((page - 1) * take)
      .take(take);

    const { 0: topics, 1: itemCount } = await this.queryTopic(
      queryBuilder,
      queryTopicDto
    ).getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { page, take },
      itemCount,
    });
    return new PageDto(topics, pageMetaDto);
  }

  public async update(
    id: number,
    topic: CreateTopicDto,
    userID: number
  ): Promise<void> {
    const topicEntity: Topic = plainToClass(Topic, topic);
    await this.topicRepository.update(
      { id, owner: { id: userID } },
      topicEntity
    );
  }

  public async getIsCorrectByTopicID(id: number): Promise<Topic> {
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

  public async getIsCorrectByUrl(url: string): Promise<Topic> {
    const result = await this.topicRepository.findOne({
      where: {
        url,
      },
      relations: ['questions', 'questions.answers'],
    });
    if (!result) throw new BadRequestException(GConfig.TOPIC_NOT_FOUND);
    return this.filterAnswerIsCorrect(result);
  }

  public async checkPermissionUserOfTopic(
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

  public async addGroupForTopic(
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

  public async checkUserIsExistUserExam(
    topicID: number,
    userID: number
  ): Promise<boolean> {
    const result = await this.topicRepository.findOne({
      where: {
        id: topicID,
        userExams: {
          owner: { id: userID },
        },
      },
    });
    if (!result) return false;
    return true;
  }

  private queryTopic(
    queryBuilder: SelectQueryBuilder<Topic>,
    queryTopicDto: QueryTopicDto
  ): SelectQueryBuilder<Topic> {
    if (queryTopicDto.timeType) {
      queryBuilder.andWhere('topic.timeType = :timeType', {
        timeType: queryTopicDto.timeType,
      });
    }
    if (queryTopicDto.typeCategoryName) {
      queryBuilder.andWhere('topic.typeCategoryName = :typeCategoryName', {
        typeCategoryName: queryTopicDto.typeCategoryName,
      });
    }
    if (queryTopicDto.searchTerm && queryTopicDto.searchTerm.length) {
      queryBuilder.andWhere(
        `MATCH(title) AGAINST ('${queryTopicDto.searchTerm}' IN BOOLEAN MODE)`
      );
    }
    return queryBuilder;
  }

  public async getTopicPublic(
    queryTopicDto: QueryTopicDto
  ): Promise<PageDto<Topic>> {
    const page = queryTopicDto?.page || 1;
    const take = queryTopicDto?.take || 10;
    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      .where('topic.isPublic = :isPublic', { isPublic: 0 })
      .leftJoin('topic.questions', 'questions')
      .loadRelationCountAndMap('topic.questionsCount', 'topic.questions')
      .skip((page - 1) * take)
      .take(take);

    const { 0: topics, 1: itemCount } = await this.queryTopic(
      queryBuilder,
      queryTopicDto
    ).getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: { page, take },
      itemCount,
    });
    return new PageDto(topics, pageMetaDto);
  }
}
