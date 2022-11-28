import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../topic/entities/topic.entity';
import { UserExam } from '../userExam/entities/userExam.entity';
import { UserAnswer } from '../userAnswer/entities/userAnswer.entity';
import { RedisModule } from '../redis/redis.module';
import { User } from './entities/user.entity';
import { firebaseModule } from '../firebase/firebase.module';
import { GroupModule } from '../group/group.module';
import { UserExamModule } from '../userExam/userExam.module';
import { UserAnswerModule } from '../userAnswer/userAnswer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, UserExam, UserAnswer, User]),
    RedisModule,
    firebaseModule,
    GroupModule,
    UserExamModule,
    UserAnswerModule,
  ],
  controllers: [UserController],
  providers: [UserService, JsonWebTokenStrategy, TopicService],
})
export class UserModule {}
