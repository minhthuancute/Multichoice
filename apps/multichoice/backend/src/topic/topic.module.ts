import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { UserService } from '../user/user.service';
import { RedisModule } from '../redis/redis.module';
import { User } from '../user/entities/user.entity';
import { firebaseModule } from '../firebase/firebase.module';
import { GroupModule } from '../group/group.module';
import { UserExamModule } from '../userExam/userExam.module';
import { UserAnswerModule } from '../userAnswer/userAnswer.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, User]),
    RedisModule,
    firebaseModule,
    GroupModule,
    UserExamModule,
    UserAnswerModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, JsonWebTokenStrategy, UserService],
})
export class TopicModule {}
