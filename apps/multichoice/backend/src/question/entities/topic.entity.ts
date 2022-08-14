import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  TopicCategoryEnum,
  TopicTimeTypeEnum,
} from '@monorepo/multichoice/constant';
import { Question } from './question.entity';
import { Timestamp } from '../../orm/timestamp.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Topic extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TopicCategoryEnum,
    default: TopicCategoryEnum.NONE,
  })
  typeName: TopicCategoryEnum;

  @Column({
    type: 'enum',
    enum: TopicTimeTypeEnum,
    default: TopicTimeTypeEnum.FIXEDTIME,
  })
  timeType: TopicTimeTypeEnum;

  @Column()
  title: string;

  @Column({ default: false })
  isDraft: boolean;

  @OneToMany(() => Question, (qs) => qs.topic)
  questions: Question[];

  @ManyToOne(() => User, (usr) => usr.topics)
  owner: User;
}
