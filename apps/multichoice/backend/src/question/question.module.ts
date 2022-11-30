import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { TopicService } from '../topic/topic.service';

import { Topic } from '../topic/entities/topic.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { UserService } from '../user/user.service';
import { RedisModule } from '../redis/redis.module';
import { User } from '../user/entities/user.entity';
import { firebaseModule } from '../firebase/firebase.module';
import { GroupModule } from '../group/group.module';
import { AnswerModule } from '../answer/answer.module';
import { UserExamModule } from '../userExam/userExam.module';
import { UserAnswerModule } from '../userAnswer/userAnswer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Topic, User]),
    RedisModule,
    firebaseModule,
    GroupModule,
    AnswerModule,
    UserExamModule,
    UserAnswerModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, TopicService, JsonWebTokenStrategy, UserService],
})
export class QuestionModule {}
