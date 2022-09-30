import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamp } from '../../orm/timestamp.entity';
import { UserExam } from './userExam';

@Entity()
export class UserAnswer extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionID: number;

  @Column({ type: 'nvarchar' })
  answerID: number | string;

  @ManyToOne(() => UserExam, (userExam) => userExam.UserAnswer, {
    onDelete: 'CASCADE',
  })
  userExam: UserExam;
}
