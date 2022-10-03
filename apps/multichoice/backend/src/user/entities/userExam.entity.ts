import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamp } from '../../orm/timestamp.entity';
import { Topic } from '../../question/entities/topic.entity';
import { UserAnswer } from './userAnswer.entity';

@Entity()
export class UserExam extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: null})
  userName: string;

  @Column({ type: 'bigint', default: 0 })
  startTime: number;

  @Column({ type: 'bigint', default: 0 })
  endTime: number;

  @Column({ default: 0 })
  point: number;

  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => Topic, (topic) => topic.userExams, { onDelete: 'CASCADE' })
  topic: Topic;

  @OneToMany(() => UserAnswer, (qs) => qs.userExam)
  userAnswer: UserAnswer[];
}
