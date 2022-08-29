import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
} from '@monorepo/multichoice/dto';
import configuration from '../config/configuration';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../question/entities/topic.entity';
import { Question } from '../question/entities/question.entity';
import { UserExam } from './entities/userExam';
import { plainToClass } from 'class-transformer';
import { UserAnswer } from './entities/userAnswer';
import { SucessResponse } from '../model/SucessResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserExam)
    private readonly userExamRepository: Repository<UserExam>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
    private readonly topicService: TopicService
  ) {}

  async endExam(resultUserDto: ResultUserDto) {
    const endDate = new Date().getTime();
    const over: number = 5 * 1000; // thơi gian trễ
    const userExam = await this.userExamRepository.findOne({
      where: { id: resultUserDto.userID },
      relations: ['topic'],
    });

    //check user thi chua
    if (!userExam) throw new BadRequestException('user nay chua thi');

    //check user da thi hay chua
    if (userExam.startTime != 0 && userExam.endTime != 0)
      throw new BadRequestException('user nay da thi');

    const topic: Topic = await this.topicService.getIsCorrectByTopicID(
      userExam.topic.id
    );
    if (!topic) throw new BadRequestException('topicid is not found');

    const exam: UserExam = new UserExam();
    exam.point = this.pointCount(topic.questions, resultUserDto);
    exam.topic = topic;
    exam.endTime = endDate;

    if (
      Number(endDate) - Number(userExam.startTime) <=
      Number(topic.expirationTime) + Number(over)
    ) {
      exam.status = true;
    }
    // update exam
    await this.userExamRepository.update({ id: userExam.id }, exam);

    // save list userAnswer
    if (resultUserDto.AnswersUserDto !== undefined) {
      const lst: UserAnswer[] = [];
      resultUserDto.AnswersUserDto.forEach((element) => {
        element.answerID.forEach((item) => {
          const userAnswer: UserAnswer = new UserAnswer();
          userAnswer.answerID = item;
          userAnswer.questionID = element.questionID;
          userAnswer.userExam = userExam;
          lst.push(userAnswer);
        });
      });
      await this.userAnswerRepository.save(lst);
    }
    if (exam.status !== true) {
      throw new BadRequestException('muộn màng rồi bé ơi!!!');
    }

    return new SucessResponse(200, {
      username: userExam.username,
      point: exam.point,
    });
  }

  async startExam(userExamDto: UserExamDto) {
    const topic = await this.topicService.fineOneByID(userExamDto.topicID);
    if (!topic) throw new BadRequestException('topic is not found');
    const exam: UserExam = plainToClass(UserExam, userExamDto);
    exam.topic = topic;
    exam.startTime = new Date().getTime();
    const result = await this.userExamRepository.save(exam);
    return new SucessResponse(200, { userid: result.id });
  }

  public pointCount(
    questions: Question[],
    resultUserDto: ResultUserDto
  ): number {
    let poit = 0;
    if (
      questions.length > 0 &&
      resultUserDto.AnswersUserDto !== undefined &&
      resultUserDto.AnswersUserDto.length > 0
    ) {
      const questionsDBB = questions.reduce((result, item) => {
        return {
          ...result,
          [item.id]: item.answers.reduce((obj, val) => {
            return {
              ...obj,
              [val.id]: true,
            };
          }, {}),
        };
      }, {});

      const aswersUserDto = resultUserDto.AnswersUserDto.reduce(
        (result, item) => {
          return {
            ...result,
            [item.questionID]: item.answerID.reduce((a, b) => {
              return { ...a, [b]: true };
            }, {}),
          };
        },
        {}
      );

      for (const key in aswersUserDto) {
        if (
          JSON.stringify(aswersUserDto[key]) ===
          JSON.stringify(questionsDBB[key])
        )
          poit++;
      }
    }

    return poit;
  }

  async findTopicByUrl(url: string): Promise<Topic> {
    const result = await this.topicService.fineOneByUrl(url);
    if (!result) throw new BadRequestException('topic is not found');
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
