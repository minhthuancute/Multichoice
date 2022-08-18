import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Timestamp } from '../../orm/timestamp.entity';
import qs = require('qs');
import { Question } from '../../question/entities/question.entity';
import { Topic } from '../../question/entities/topic.entity';

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: false })
  password: string;

  @OneToMany(() => Topic, (topic) => topic.owner)
  topics: Topic[];

  @Column({ default: true })
  isActive: boolean;
}
//
