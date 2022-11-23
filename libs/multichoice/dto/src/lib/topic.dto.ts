import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from './pageOptions.dto';

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

  @ApiProperty({ default: false })
  isPrivate: boolean;

  @ApiProperty()
  expirationTime: number;
}

export class AddGroupForTopic {
  @ApiProperty()
  topicID: number;

  @ApiProperty()
  groupID: number;
  // @ApiProperty({
  //   isArray: true,
  //   type: Number,
  // })
  // arrayUser: number[];
}

export class QueryTopicDto extends PageOptionsDto {
  @ApiProperty({
    enum: TopicTimeTypeEnum,
    default: TopicTimeTypeEnum.FIXEDTIME,
  })
  timeType: TopicTimeTypeEnum;

  @ApiProperty({ enum: TopicCategoryEnum, default: TopicCategoryEnum.NONE })
  typeCategoryName: TopicCategoryEnum;

  @ApiProperty()
  title: string;
}
