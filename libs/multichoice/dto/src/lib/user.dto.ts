import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validation } from '@monorepo/multichoice/validation';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(validation().username.minLength)
  @MaxLength(validation().username.maxLength)
  username: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(validation().email.maxLength)
  email: string;

  @ApiProperty()
  @MinLength(validation().password.minLength)
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  username: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  @MinLength(validation().password.minLength)
  password: string;

  @ApiProperty()
  @MinLength(validation().password.minLength)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(validation().email.maxLength)
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  @MinLength(validation().password.minLength)
  password: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(validation().email.maxLength)
  email: string;

  @ApiProperty()
  @MinLength(validation().password.minLength)
  password: string;
}

export class AnswersUserDto {
  @ApiProperty()
  questionID: number;

  @ApiProperty({ type: [Number] })
  answerID: number[] | string;
  constructor() {
    this.answerID = [];
  }
}

export class UserExamDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  topicID: number;
}

export class ResultUserDto {
  @ApiProperty()
  userID: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ type: [AnswersUserDto] })
  answerUsers: AnswersUserDto[];
}

export interface IUserDoExam {
  username: string;
  point: number;
  startTime: number;
  endTime: number;
  duration: number;
  userID: number;
}
export interface IUserDoExamDetail extends IUserDoExam {
  questions: QuestionDetail[];
}

export class QuestionDetail {
  id: number;
  type: QuestionTypeEnum;

  content: string;

  time: number;

  isActive: boolean;

  answers: Answer[];
  answerUser: number[] | string;
  constructor() {
    this.answers = [];
    this.answerUser = [];
  }
}

export interface Answer {
  id: number;
  content: string;
  isCorrect: boolean;
}

export class IUserExam {
  public username: string;
  public point: number;
  public time: number;
  constructor(
    username: string,
    point: number,
    startTime: number,
    endTime: number
  ) {
    this.username = username;
    this.point = point;
    this.time = endTime - startTime;
  }
}
export class tokenDto {
  @ApiProperty()
  token: string;
}
