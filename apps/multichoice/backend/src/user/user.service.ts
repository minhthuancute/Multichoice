import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  AnswersUserDto,
  IUserDoExam,
  IUserDoExamdetail,
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
} from '@monorepo/multichoice/dto';
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
    @InjectRepository(UserExam)
    private readonly userExamRepository: Repository<UserExam>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService
  ) {}

  convertListUserDoExam(userExams: UserExam[]): IUserDoExam[] {
    const lst: IUserDoExam[] = [];
    userExams.forEach((element) => {
      lst.push(this.convertUserDoExam(element));
    });
    return lst;
  }
  convertUserDoExam(userExams: UserExam): IUserDoExam {
    const userDoExam: IUserDoExam = {
      userName: userExams.username,
      start_time: Number(userExams.startTime),
      end_time: Number(userExams.endTime),
      duration: Number(userExams.endTime) - Number(userExams.startTime),
      point: userExams.point,
    };

    return userDoExam;
  }

  convertUserDoExamdetal(userExams: UserExam): IUserDoExamdetail {
    const result: IUserDoExamdetail = {
      userName: userExams.username,
      start_time: Number(userExams.startTime),
      end_time: Number(userExams.endTime),
      duration: Number(userExams.endTime) - Number(userExams.startTime),
      point: userExams.point,
      AnswersUsers: this.genarateAnswersUser(userExams.UserAnswer),
    };

    return result;
  }

  genarateAnswersUser(lst: UserAnswer[]): AnswersUserDto[] {
    const result: AnswersUserDto[] = [];
    const check: number[] = []; // check xem question ton tai chua?
    lst.forEach((element) => {
      if (check.includes(element.questionID)) {
        result[check.indexOf(element.questionID)].answerID.push(
          element.answerID
        );
      } else {
        const tam: AnswersUserDto = new AnswersUserDto();
        tam.questionID = element.questionID;
        tam.answerID.push(element.answerID);
        result.push(tam);
        check.push(element.questionID);
      }
    });
    return result;
  }

  async getUserExamdetail(topicID: number, userID: number, user: User) {
    if (!(await this.topicService.checkAuth(topicID, user)))
      throw new BadRequestException('You do not have permission');

    const result = await this.userExamRepository.findOne({
      where: {
        id: userID,
        topic: { id: topicID },
      },
      relations: ['UserAnswer'],
    });
    if (!result) throw new BadRequestException('User is not found');
    return new SucessResponse(200, this.convertUserDoExamdetal(result));
  }

  async getUserExamByTopic(id: number, user: User) {
    if (await this.topicService.checkAuth(id, user)) {
      const result = await this.findOneByTopicID(id);
      return new SucessResponse(200, this.convertListUserDoExam(result));
    }
    throw new BadRequestException('You do not have permission');
  }

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
      throw new BadRequestException('Bạn đã nộp bài');
    console.log(userExam.topic.id);
    const topic: Topic = await this.topicService.getIsCorrectByTopicID(
      userExam.topic.id
    );
    if (!topic) throw new BadRequestException('topicid is not found');

    const exam: UserExam = new UserExam();
    exam.point = this.pointCount(topic.questions, resultUserDto);
    exam.topic = topic;
    exam.endTime = endDate;
    // thoi gian làm bài của user
    const time = Number(endDate) - Number(userExam.startTime);
    if (time <= Number(topic.expirationTime) + Number(over)) {
      exam.status = true;
    }
    // update exam
    await this.userExamRepository.update({ id: userExam.id }, exam);

    // save list userAnswer
    if (resultUserDto.AnswersUsers !== undefined) {
      const lst: UserAnswer[] = [];
      resultUserDto.AnswersUsers.forEach((element) => {
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
      throw new BadRequestException('Hết thời gian làm bài');
    }

    return new SucessResponse(200, {
      username: userExam.username,
      point: exam.point,
      time,
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
      resultUserDto.AnswersUsers !== undefined &&
      resultUserDto.AnswersUsers.length > 0
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

      const aswersUserDto = resultUserDto.AnswersUsers.reduce(
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
    return result;
  }

  async findOneByTopicID(topicId: number): Promise<UserExam[]> {
    return this.userExamRepository
      .createQueryBuilder('userExam')
      .where('userExam.topicId = :topicId', { topicId })
      .getMany();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
