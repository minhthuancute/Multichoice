import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../question/entities/topic.entity';
import { UserExam } from './entities/userExam';
import { UserAnswer } from './entities/userAnswer';
import { Question } from '../question/entities/question.entity';
import { QuestionService } from '../question/question.service';
import { Answer } from '../answer/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, UserExam, UserAnswer])],
  controllers: [UserController],
  providers: [UserService, JsonWebTokenStrategy, TopicService],
})
export class UserModule {}
