import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExam } from './entities/userExam.entity';
import { UserExamService } from './userExam.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserExam])],
  providers: [UserExamService],
  exports: [UserExamService],
})
export class UserExamModule {}
