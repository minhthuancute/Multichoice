import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamp } from '../../orm/timestamp.entity';
import { Topic } from '../../question/entities/topic.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Group extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.groups)
  owner: User;

  @ManyToMany(() => Topic, (topic) => topic.groups, {
    cascade: true,
  })
  @JoinTable()
  topics: Topic[];

  @ManyToMany(() => User, (user) => user.groupUser, {
    cascade: true,
  })
  @JoinTable()
  users: User[];
}
