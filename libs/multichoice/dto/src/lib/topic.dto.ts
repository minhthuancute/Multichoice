import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({
    enum: TopicTimeTypeEnum,
    default: TopicTimeTypeEnum.FIXEDTIME,
  })
  timeType: TopicTimeTypeEnum;

  @ApiProperty({ enum: TopicCategoryEnum, default: TopicCategoryEnum.NONE })
  typeCategoryName: TopicCategoryEnum;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ default: false })
  isDraft: boolean;

  @ApiProperty()
  expirationTime: number;
}

export class PageDto {
  @ApiProperty({ default: 0, required: false })
  page: number;

  @ApiProperty({ default: 10, required: false })
  limit: number;
}
