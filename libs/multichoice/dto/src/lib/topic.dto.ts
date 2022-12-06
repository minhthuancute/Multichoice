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
  isPublic: boolean;

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
    required: false,
  })
  timeType: TopicTimeTypeEnum;

  @ApiProperty({
    enum: TopicCategoryEnum,
    default: TopicCategoryEnum.NONE,
    required: false,
  })
  typeCategoryName: TopicCategoryEnum;

  @ApiProperty({ required: false })
  searchTerm: string;
}
