import {
  Column,
  Entity,
  Generated,
  Index,
  ManyToMany,
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
import { UserExam } from '../../user/entities/userExam.entity';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class Topic extends Timestamp {
  constructor(id: number) {
    super();
    this.id = id;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TopicCategoryEnum,
    default: TopicCategoryEnum.NONE,
  })
  typeCategoryName: TopicCategoryEnum;

  @Column({
    type: 'enum',
    enum: TopicTimeTypeEnum,
    default: TopicTimeTypeEnum.FIXEDTIME,
  })
  timeType: TopicTimeTypeEnum;

  @Index({ fulltext: true })
  @Column()
  title: string;

  @Column()
  @Generated('uuid')
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isDraft: boolean;

  @Column({ type: 'bigint' })
  expirationTime: number;

  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => Question, (qs) => qs.topic)
  questions: Question[];

  @ManyToOne(() => User, (usr) => usr.topics)
  owner: User;

  @OneToMany(() => UserExam, (qs) => qs.topic)
  userExams: UserExam[];

  @ManyToMany(() => Group, (group) => group.topics)
  groups: Group[];
}
