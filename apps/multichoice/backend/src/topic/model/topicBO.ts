import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';

import { Timestamp } from '../../orm/timestamp.entity';

export class TopicBO extends Timestamp {
  id: number;

  typeCategoryName: TopicCategoryEnum;

  timeType: TopicTimeTypeEnum;

  title: string;

  url: string;

  description: string;

  isDraft: boolean;

  expirationTime: number;

  totalQuestion: number;
}
