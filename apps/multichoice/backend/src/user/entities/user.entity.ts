import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Timestamp } from '../../orm/timestamp.entity';
import { Topic } from '../../question/entities/topic.entity';
import { Group } from '../../group/entities/group.entity';

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

  @OneToMany(() => Group, (group) => group.owner)
  groups: Group[];

  @ManyToMany(() => Group, (group) => group.users)
  groupUser: Group[];

  @Column({ default: true })
  isActive: boolean;
}
