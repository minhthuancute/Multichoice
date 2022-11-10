import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AnswersUserDto,
  IUserDoExam,
  IUserDoExamdetail,
  IUserExam,
  Questiondetail,
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
import { UserExam } from './entities/userExam.entity';
import { UserAnswer } from './entities/userAnswer.entity';
import {
  firebasePath,
  QuestionTypeEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { GConfig } from '../config/gconfig';
import { RedisService } from '../redis/redis.service';
import { FirebaseService } from '../firebase/firebase.service';
import { realtimeExam } from '../firebase/dto/realtimeExam.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserExam)
    private readonly userExamRepository: Repository<UserExam>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly redisService: RedisService,
    private readonly firebaseService: FirebaseService
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
      username: userExams.username,
      startTime: Number(userExams.startTime),
      endTime: Number(userExams.endTime),
      duration: Number(userExams.endTime) - Number(userExams.startTime),
      point: userExams.point,
      userID: userExams.id,
    };

    return userDoExam;
  }

  convertUserDoExamdetail(
    userExams: UserExam,
    topic: Topic
  ): IUserDoExamdetail {
    const result: IUserDoExamdetail = {
      username: userExams.username,
      startTime: Number(userExams.startTime),
      endTime: Number(userExams.endTime),
      duration: Number(userExams.endTime) - Number(userExams.startTime),
      point: userExams.point,
      questions: this.genarateAnswersUser(
        userExams.userAnswer,
        topic.questions
      ),
      userID: userExams.id,
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
        const answer = Number(element?.answerID);
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

  async getUserExamdetail(
    topicID: number,
    userID: number,
    user: User
  ): Promise<IUserDoExamdetail> {
    const topic = await this.topicService.getTopicByID(topicID, user);

    const result = await this.userExamRepository.findOne({
      where: {
        id: userID,
        topic: { id: topicID },
      },
      relations: ['userAnswer'],
    });
    if (!result) throw new BadRequestException(GConfig.USER_NOT_FOUND);
    return this.convertUserDoExamdetail(result, topic);
  }

  async getUserExamByTopic(id: number, user: User): Promise<IUserDoExam[]> {
    if (await this.topicService.checkAuth(id, user)) {
      const result = await this.findOneByTopicID(id);
      return this.convertListUserDoExam(result);
    }
    throw new BadRequestException(GConfig.NOT_PERMISSION_VIEW);
  }

  async endExamRealTime(resultUserRealTimeDto: ResultUserDto, user: User) {
    const endTime = new Date().getTime();
    if (resultUserRealTimeDto.url == undefined)
      throw new BadRequestException(GConfig.URL_NOT_EMPTY);
    const topic = await this.topicService.getIsCorrectByUrl(
      resultUserRealTimeDto.url
    );

    if (topic.isPrivate) {
      await this.topicService.checkPermissionUserOfTopic(topic.id, user.id);
    }

    const exam: UserExam = new UserExam();

    const dataFirebase: realtimeExam = (await this.firebaseService.get(
      `${firebasePath}-${resultUserRealTimeDto.url}`
    )) as realtimeExam;

    if (dataFirebase && dataFirebase.started) {
      exam.startTime = dataFirebase.startTime;
      exam.username = user.username;
      exam.topic = topic;
      exam.endTime = endTime;
      if (
        Number(endTime) >=
        Number(topic.expirationTime) + Number(exam.startTime)
      )
        exam.status = true;

      exam.point = this.pointCount(
        topic.questions,
        resultUserRealTimeDto.answerUsers
      );
      const saveUserExam = await this.userExamRepository.save(exam);
      this.saveListUserAnswer(resultUserRealTimeDto.answerUsers, saveUserExam);
      return new IUserExam(
        saveUserExam.username,
        saveUserExam.point,
        saveUserExam.startTime,
        endTime
      );
    }
  }

  saveListUserAnswer(answersUserDto: AnswersUserDto[], userExam: UserExam) {
    if (answersUserDto !== undefined) {
      const lst: UserAnswer[] = [];
      answersUserDto.forEach((element) => {
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
      this.userAnswerRepository.save(lst);
    }
  }
  async endExam(resultUserDto: ResultUserDto) {
    const endTime = new Date().getTime();
    const userID: string = resultUserDto.userID.toString();

    // get data redis
    const userExam: UserExam = await this.redisService.get(userID);
    if (!userExam) throw new BadRequestException(GConfig.EXPRIED_TIME);

    //xóa key trong redis
    this.redisService.delete(userID);

    const topic: Topic = await this.topicService.getIsCorrectByTopicID(
      userExam.topic.id
    );

    userExam.endTime = endTime;
    userExam.point = this.pointCount(
      topic.questions,
      resultUserDto.answerUsers
    );
    userExam.topic = topic;
    const saveUserExam = await this.userExamRepository.save(userExam);
    this.saveListUserAnswer(resultUserDto.answerUsers, saveUserExam);

    return new IUserExam(
      saveUserExam.username,
      saveUserExam.point,
      saveUserExam.startTime,
      endTime
    );
  }

  uniqueID(): number {
    return Math.floor(Math.random() * Date.now());
  }

  async startExam(userExamDto: UserExamDto, user: User) {
    const topic = await this.topicService.fineOneByID(userExamDto.topicID);

    if (topic.isPrivate) {
      if (!user) throw new UnauthorizedException();
      await this.topicService.checkPermissionUserOfTopic(topic.id, user.id);
    }

    const exam: UserExam = new UserExam();
    exam.username = topic.isPrivate ? user.username : userExamDto.username;
    exam.topic = new Topic(topic.id);
    exam.startTime = new Date().getTime();

    const userid = this.uniqueID();
    const over: number = 5 * 1000; // thời gian trễ

    this.redisService.set(
      userid.toString(),
      exam,
      (Number(topic.expirationTime) + Number(over)) / 1000 // chuyển về đơn vị giây
    );

    return { userid };
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public pointCount(
    questions: Question[],
    answersUserDto: AnswersUserDto[]
  ): number {
    let poit = 0;
    if (
      questions.length > 0 &&
      answersUserDto !== undefined &&
      answersUserDto.length > 0
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
      const aswersUserDto = answersUserDto.reduce((result, item) => {
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
      }, {});

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

  async checkTopicRealTime(topic: Topic) {
    if (topic.timeType === TopicTimeTypeEnum.REALTIME) {
      const checkRealTimeExam: realtimeExam = (await this.firebaseService.get(
        `${firebasePath}-${topic.url}`
      )) as realtimeExam;

      if (!checkRealTimeExam || !checkRealTimeExam.started) {
        delete topic.questions;
      }
    }
  }

  async findTopicByUrl(url: string): Promise<Topic> {
    const result = await this.topicService.findOneByUrl(url);
    await this.checkTopicRealTime(result);
    return result;
  }

  async findOneByTopicID(topicId: number): Promise<UserExam[]> {
    return this.userExamRepository
      .createQueryBuilder('userExam')
      .where('userExam.topicId = :topicId', { topicId })
      .getMany();
  }

  async getUserExambyID(userID: number): Promise<UserExam> {
    return await this.userExamRepository.findOne({
      where: { id: userID },
      relations: ['topic'],
    });
  }

  async deleteUserExamByID(userID: number, user: User): Promise<void> {
    const userExam = await this.getUserExambyID(userID);
    if (!userExam) throw new BadRequestException(GConfig.USER_NOT_FOUND);

    if (!(await this.topicService.checkAuth(userExam.topic.id, user)))
      throw new BadRequestException(GConfig.NOT_PERMISSION_DELETE);

    await this.userExamRepository.delete({ id: userID });
  }

  convertUserEntity(updateUserDto: UpdateUserDto, file: any): User {
    const user: User = new User();
    if (updateUserDto.username && updateUserDto.username.length > 0)
      user.username = updateUserDto.username;
    if (file && file.avatar !== undefined)
      user.avatar = file.avatar[0].filename;

    return user;
  }

  async updateUserByID(
    updateUserDto: UpdateUserDto,
    file: any,
    user: User
  ): Promise<void> {
    await this.userRepository.update(
      { id: user.id },
      this.convertUserEntity(updateUserDto, file)
    );
  }
}
