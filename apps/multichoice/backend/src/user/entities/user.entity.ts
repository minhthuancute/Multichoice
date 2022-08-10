import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Timestamp } from '../../orm/timestamp.entity';

@Entity({ name: 'users' })
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
