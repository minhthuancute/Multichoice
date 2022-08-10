import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionTypeEnum } from '@monorepo/multichoice/constant';
import { Question } from './question.entity';

@Entity()
export class QuestionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.SINGLE,
  })
  typeName: QuestionTypeEnum;

  @OneToMany(() => Question, (qs) => qs.type)
  questions: Question[];
}
