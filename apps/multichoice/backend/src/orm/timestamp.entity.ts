import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Timestamp {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
