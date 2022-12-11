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
  IUserDoExamDetail,
  IUserExam,
  QuestionDetail,
  ResultUserDto,
  UpdateUserDto,
  UserExamDto,
} from '@monorepo/multichoice/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../topic/entities/topic.entity';
import { Question } from '../question/entities/question.entity';
import { UserExam } from '../userExam/entities/userExam.entity';
import { UserAnswer } from '../userAnswer/entities/userAnswer.entity';
import {
  firebasePath,
  QuestionTypeEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { GConfig } from '../config/gconfig';
import { RedisService } from '../redis/redis.service';
import { FirebaseService } from '../firebase/firebase.service';
import { realtimeExam } from '../firebase/dto/realtimeExam.dto';
import { UserExamService } from '../userExam/userExam.service';
import { UserAnswerService } from '../userAnswer/userAnswer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly redisService: RedisService,
    private readonly firebaseService: FirebaseService,
    private readonly userExamService: UserExamService,
    private readonly userAnswerService: UserAnswerService
  ) {}

  private convertListUserDoExam(userExams: UserExam[]): IUserDoExam[] {
    const lst: IUserDoExam[] = [];
    userExams.forEach((element) => {
      lst.push(this.convertUserDoExam(element));
    });
    return lst;
  }

  private convertUserDoExam(userExams: UserExam): IUserDoExam {
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

  private convertUserDoExamDetail(
    userExam: UserExam,
    topic: Topic
  ): IUserDoExamDetail {
    const result: IUserDoExamDetail = {
      username: userExam.username,
      startTime: Number(userExam.startTime),
      endTime: Number(userExam.endTime),
      duration: Number(userExam.endTime) - Number(userExam.startTime),
      point: userExam.point,
      questions: this.genarateAnswersUser(userExam.userAnswer, topic.questions),
      userID: userExam.id,
    };
    return result;
  }

  private convertQuestionDetail(question: Question): QuestionDetail {
    const result = new QuestionDetail();
    result.id = question.id;
    result.type = question.type;
    result.isActive = question.isActive;
    result.content = question.content;
    result.time = question.time;
    if (question.answers && question.answers.length) {
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

  private genarateAnswersUser(
    lst: UserAnswer[],
    questions: Question[]
  ): QuestionDetail[] {
    const answersUser: AnswersUserDto[] = [];
    const lstQuestion: number[] = []; // check xem question ton tai chua?
    if (lst && lst.length) {
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

    if (questions && questions.length) {
      const result: QuestionDetail[] = [];
      questions.forEach((element) => {
        const question = this.convertQuestionDetail(element);
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

  public async getUserExamDetail(
    topicID: number,
    userExamID: number,
    userID: number
  ): Promise<IUserDoExamDetail> {
    const topic = await this.topicService.getTopicByIdAndUserId(
      topicID,
      userID
    );

    const result = await this.userExamService.getUserExamByIdAndTopicID(
      userExamID,
      topicID
    );
    if (!result) throw new BadRequestException(GConfig.USER_NOT_FOUND);
    return this.convertUserDoExamDetail(result, topic);
  }

  public async getUserExamByTopic(
    id: number,
    userID: number
  ): Promise<IUserDoExam[]> {
    const result = await this.userExamService.getUserExamByTopicID(id, userID);
    if (result.length) {
      return this.convertListUserDoExam(result);
    }
    throw new BadRequestException(GConfig.NOT_PERMISSION_VIEW);
  }

  public async endExamRealTime(
    resultUserRealTimeDto: ResultUserDto,
    user: User
  ) {
    const endTime = new Date().getTime();
    if (!resultUserRealTimeDto.url)
      throw new BadRequestException(GConfig.URL_NOT_EMPTY);
    const topic = await this.topicService.getIsCorrectByUrl(
      resultUserRealTimeDto.url
    );

    if (topic.timeType === TopicTimeTypeEnum.FIXEDTIME)
      throw new BadRequestException(GConfig.TOPIC_NOT_REALTIME);

    if (!topic.isPublic)
      await this.topicService.checkPermissionUserOfTopic(topic.id, user.id);

    if (await this.topicService.checkUserIsExistUserExam(topic.id, user.id))
      throw new BadRequestException(GConfig.USER_EXISTS_USEREXAM);

    const exam: UserExam = new UserExam();

    const dataFirebase: realtimeExam = (await this.firebaseService.get(
      `${firebasePath}-${resultUserRealTimeDto.url}`
    )) as realtimeExam;

    if (dataFirebase && dataFirebase.started) {
      if (
        Number(endTime) >=
        Number(topic.expirationTime) + Number(exam.startTime)
      )
        throw new BadRequestException(GConfig.EXPRIED_TIME);

      exam.startTime = dataFirebase.startTime;
      exam.username = user.username;
      exam.topic = topic;
      exam.endTime = endTime;
      exam.point = this.pointCount(
        topic.questions,
        resultUserRealTimeDto.answerUsers
      );
      exam.owner = user;

      const saveUserExam = await this.userExamService.save(exam);
      await this.userAnswerService.saveListUserAnswer(
        resultUserRealTimeDto.answerUsers,
        saveUserExam
      );
      return new IUserExam(
        saveUserExam.username,
        saveUserExam.point,
        saveUserExam.startTime,
        endTime
      );
    }
  }

  async endExam(resultUserDto: ResultUserDto) {
    const endTime = new Date().getTime();
    const userID: string = resultUserDto.userID?.toString() || '0';

    const userExam: UserExam = await this.redisService.get(userID);
    if (!userExam) throw new BadRequestException(GConfig.EXPRIED_TIME);

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
    const saveUserExam = await this.userExamService.save(userExam);
    await this.userAnswerService.saveListUserAnswer(
      resultUserDto.answerUsers,
      saveUserExam
    );

    return new IUserExam(
      saveUserExam.username,
      saveUserExam.point,
      saveUserExam.startTime,
      endTime
    );
  }

  private uniqueID(): number {
    return Math.floor(Math.random() * Date.now());
  }

  public async startExam(userExamDto: UserExamDto, user: User) {
    const topic = await this.topicService.fineOneByID(userExamDto.topicID);
    if (topic.timeType === TopicTimeTypeEnum.REALTIME)
      throw new BadRequestException(GConfig.TOPIC_NOT_FIXEDTIME);

    const exam: UserExam = new UserExam();

    // guest user
    if (!user) {
      if (!topic.isPublic) throw new UnauthorizedException();
      if (!userExamDto.username)
        throw new BadRequestException(GConfig.USERNAME_NOT_EMPTY);
      exam.username = userExamDto.username;
    }

    if (!topic.isPublic)
      await this.topicService.checkPermissionUserOfTopic(topic.id, user.id);
    exam.username = user.username;
    exam.owner = new User(user.id);

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

  public async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  private pointCount(
    questions: Question[],
    answersUserDto: AnswersUserDto[]
  ): number {
    let poit = 0;
    if (questions.length && answersUserDto && answersUserDto.length) {
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

  private async checkTopicRealTime(topic: Topic) {
    if (topic.timeType === TopicTimeTypeEnum.REALTIME) {
      const checkRealTimeExam: realtimeExam = (await this.firebaseService.get(
        `${firebasePath}-${topic.url}`
      )) as realtimeExam;

      if (!checkRealTimeExam || !checkRealTimeExam.started) {
        delete topic.questions;
      }
    }
  }

  public async findTopicByUrl(url: string): Promise<Topic> {
    const result = await this.topicService.findOneByUrl(url);
    await this.checkTopicRealTime(result);
    return result;
  }

  public async deleteUserExamByID(
    userExamID: number,
    userID: number
  ): Promise<void> {
    await this.userExamService.deleteUserExamByID(userExamID, userID);
  }

  private convertUserEntity(updateUserDto: UpdateUserDto, file: any): User {
    const user: User = new User();
    if (updateUserDto.username && updateUserDto.username.length)
      user.username = updateUserDto.username;
    if (file && file.avatar) user.avatar = file.avatar[0].filename;

    return user;
  }

  public async updateUserByID(
    updateUserDto: UpdateUserDto,
    file: any,
    userID: number
  ): Promise<void> {
    await this.userRepository.update(
      { id: userID },
      this.convertUserEntity(updateUserDto, file)
    );
  }
}
