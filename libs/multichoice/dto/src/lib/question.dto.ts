import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { ApiProperty } from '@nestjs/swagger';
import { CreatAnswer, UpdateAnswer } from './answer.dto';

export class CreateQuestionDto {
  @ApiProperty()
  topicID: number;

  @ApiProperty({ enum: QuestionTypeEnum, default: QuestionTypeEnum.SINGLE })
  type: QuestionTypeEnum;

  @ApiProperty()
  content: string;

  @ApiProperty()
  time: number;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ type: [CreatAnswer] })
  answers: CreatAnswer[];
}

export class UpdateQuestionDto {
  @ApiProperty({ enum: QuestionTypeEnum, default: QuestionTypeEnum.SINGLE })
  type: QuestionTypeEnum;

  @ApiProperty()
  content: string;

  @ApiProperty()
  time: number;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ type: [UpdateAnswer] })
  answers: UpdateAnswer[];
}
