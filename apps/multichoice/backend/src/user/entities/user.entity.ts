import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Timestamp } from '../../orm/timestamp.entity';
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

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Topic, (topic) => topic.owner)
  topics: Topic[];

  @Column({ default: true })
  isActive: boolean;
}
//
