import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { TopicService } from '../topic/topic.service';
import { TopicModule } from '../topic/topic.module';
import { Topic } from './entities/topic.entity';
import { Answer } from '../answer/entities/answer.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { UserService } from '../user/user.service';
import { UserExam } from '../user/entities/userExam';
import { UserAnswer } from '../user/entities/userAnswer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Topic, Answer, UserExam, UserAnswer]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService, TopicService, JsonWebTokenStrategy, UserService],
})
export class QuestionModule {}
