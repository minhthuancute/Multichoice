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
  Questiondetail,
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
  Answer,
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
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';

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
      userId: userExams.id,
    };

    return userDoExam;
  }

  convertUserDoExamdetal(userExams: UserExam, topic: Topic): IUserDoExamdetail {
    const result: IUserDoExamdetail = {
      userName: userExams.username,
      start_time: Number(userExams.startTime),
      end_time: Number(userExams.endTime),
      duration: Number(userExams.endTime) - Number(userExams.startTime),
      point: userExams.point,
      questions: this.genarateAnswersUser(
        userExams.UserAnswer,
        topic.questions
      ),
      userId: userExams.id,
    };
    return result;
  }

  convertQuestiondetail(question: Question): Questiondetail {
    const result = new Questiondetail();
    result.id = question.id;
    result.type = question.type;
    result.isActive = question.isActive;
    result.content = question.content;
    result.time = question.time;
    if (question.answers && question.answers.length > 0) {
      question.answers.forEach((answer) => {
        result.answers.push({
          content: answer.content,
          id: answer.id,
          isCorrect: answer.isCorrect,
        });
      });
    }
    return result;
  }

  genarateAnswersUser(
    lst: UserAnswer[],
    questions: Question[]
  ): Questiondetail[] {
    const answersUser: AnswersUserDto[] = [];
    const lstQuestion: number[] = []; // check xem question ton tai chua?
    if (lst && lst.length > 0) {
      lst.forEach((element) => {
        const tam: AnswersUserDto = new AnswersUserDto();
        const answer = Number(element.answerID);
        if (Number.isFinite(answer)) {
          if (lstQuestion.includes(element.questionID)) {
            (
              answersUser[lstQuestion.indexOf(element.questionID)]
                .answerID as number[]
            ).push(answer);
          } else {
            tam.questionID = element.questionID;
            (tam.answerID as number[]).push(answer);
            answersUser.push(tam);
            lstQuestion.push(element.questionID);
          }
        } else {
          tam.questionID = element.questionID;
          (tam.answerID as string) = element.answerID as string;
          answersUser.push(tam);
          lstQuestion.push(element.questionID);
        }
      });
    }

    if (questions && questions.length > 0) {
      const result: Questiondetail[] = [];
      questions.forEach((element) => {
        const question = this.convertQuestiondetail(element);
        //push dap an user
        const check = lstQuestion.indexOf(element.id);
        if (check != -1) {
          if (element.type === QuestionTypeEnum.TEXT) {
            question.answerUser = answersUser[check].answerID.toString();
          } else {
            question.answerUser = answersUser[check].answerID;
          }
        }
        result.push(question);
      });
      return result;
    }
    return null;
  }

  async getUserExamdetail(topicID: number, userID: number, user: User) {
    const topic = await this.topicService.getTopicByID(topicID, user);

    const result = await this.userExamRepository.findOne({
      where: {
        id: userID,
        topic: { id: topicID },
      },
      relations: ['UserAnswer'],
    });
    if (!result) throw new BadRequestException('User is not found');
    return new SucessResponse(200, this.convertUserDoExamdetal(result, topic));
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
        if (typeof element.answerID === 'object') {
          element.answerID.forEach((item) => {
            const userAnswer: UserAnswer = new UserAnswer();
            userAnswer.answerID = item;
            userAnswer.questionID = element.questionID;
            userAnswer.userExam = userExam;
            lst.push(userAnswer);
          });
        } else {
          const userAnswer: UserAnswer = new UserAnswer();
          userAnswer.answerID = element.answerID;
          userAnswer.questionID = element.questionID;
          userAnswer.userExam = userExam;
          lst.push(userAnswer);
        }
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
          if (typeof item.answerID === 'object') {
            return {
              ...result,
              [item.questionID]: item.answerID.reduce((a, b) => {
                return { ...a, [b]: true };
              }, {}),
            };
          } else {
            return { ...result };
          }
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
    const result = await this.topicService.findOneByUrl(url);
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

  async getUserExambyID(userID: number): Promise<UserExam> {
    return await this.userExamRepository.findOne({
      where: { id: userID },
      relations: ['topic'],
    });
  }

  async deleteUserExamByID(
    userID: number,
    user: User
  ): Promise<SucessResponse> {
    const userExam = await this.getUserExambyID(userID);
    if (!userExam) throw new BadRequestException('user is not found');

    if (!(await this.topicService.checkAuth(userExam.topic.id, user)))
      throw new BadRequestException('You do not have permission');

    await this.userExamRepository.delete({ id: userID });
    return new SucessResponse(200, 'Sucess');
  }
}
