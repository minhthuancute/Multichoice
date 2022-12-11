import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GConfig } from '../config/gconfig';
import { UserExam } from './entities/userExam.entity';

@Injectable()
export class UserExamService {
  constructor(
    @InjectRepository(UserExam)
    private readonly userExamRepository: Repository<UserExam>
  ) {}
  public async save(userExam: UserExam): Promise<UserExam> {
    return await this.userExamRepository.save(userExam);
  }

  public async getUserExamByTopicID(
    topicId: number,
    userID: number
  ): Promise<UserExam[]> {
    return this.userExamRepository.find({
      where: {
        topic: {
          id: topicId,
          owner: {
            id: userID,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  public async getUserExamByIdAndTopicID(
    userExamID: number,
    topicID: number
  ): Promise<UserExam> {
    return await this.userExamRepository.findOne({
      where: {
        id: userExamID,
        topic: { id: topicID },
      },
      relations: ['userAnswer'],
    });
  }

  private async checkOwnerUserExam(
    userExamID: number,
    userID: number
  ): Promise<boolean> {
    if (
      await this.userExamRepository.findOne({
        where: {
          id: userExamID,
          topic: { owner: { id: userID } },
        },
      })
    )
      return true;
    return false;
  }

  public async deleteUserExamByID(
    userExamID: number,
    userID: number
  ): Promise<void> {
    if (!(await this.checkOwnerUserExam(userExamID, userID)))
      throw new BadRequestException(GConfig.NOT_PERMISSION_DELETE);

    await this.userExamRepository.delete({
      id: userExamID,
    });
  }
}
