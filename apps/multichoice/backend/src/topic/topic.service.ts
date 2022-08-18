import { CreateTopicDto } from '@monorepo/multichoice/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { SucessResponse } from '../model/SucessResponse';
import { Topic } from '../question/entities/topic.entity';
import { User } from '../user/entities/user.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private readonly topicRepository: Repository<Topic>
  ) {}

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
    return result;
  }

  async deleteById(id: number): Promise<boolean> {
    await this.topicRepository.delete(id);
    return true;
  }
}
