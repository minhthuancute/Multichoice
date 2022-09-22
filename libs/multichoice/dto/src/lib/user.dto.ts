import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validation } from '@monorepo/multichoice/validation';
import { type } from 'os';

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
}

export class UpdateUserDto {
  @ApiProperty()
  @MinLength(validation().username.minLength)
  @MaxLength(validation().username.maxLength)
  username: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  @MinLength(validation().password.minLength)
  password: string;

  @ApiProperty()
  @MinLength(validation().password.minLength)
  newPassword: string;
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
  answerID: number[];
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

  @ApiProperty({ type: [AnswersUserDto] })
  AnswersUsers: AnswersUserDto[];
}

export interface IUserDoExam {
  userName: string;
  point: number;
  start_time: number;
  end_time: number;
  duration: number;
}
export interface IUserDoExamdetail extends IUserDoExam {
  AnswersUsers: AnswersUserDto[];
}
