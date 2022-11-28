import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswer } from './entities/userAnswer.entity';
import { UserAnswerService } from './userAnswer.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAnswer])],
  providers: [UserAnswerService],
  exports: [UserAnswerService],
})
export class UserAnswerModule {}
