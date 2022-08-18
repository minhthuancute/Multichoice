import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamp } from '../../orm/timestamp.entity';
import { QuestionType } from './question-type.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Topic } from './topic.entity';

@Entity()
export class Question extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  time: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  audio: string;

  @ManyToOne(() => QuestionType, (type) => type.questions)
  type: QuestionType;

  @OneToMany(() => Answer, (ans) => ans.question)
  answers: Answer[];

  @ManyToOne(() => Topic, (ans) => ans.questions, {
    onDelete: 'CASCADE',
  })
  topic: Topic;
}
