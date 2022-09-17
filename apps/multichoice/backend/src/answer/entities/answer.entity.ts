import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { Timestamp } from '../../orm/timestamp.entity';

@Entity()
export class Answer extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne(() => Question, (qs) => qs.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;
}
