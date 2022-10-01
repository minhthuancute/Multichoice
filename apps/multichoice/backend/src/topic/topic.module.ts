import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '../question/entities/topic.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { UserExam } from '../user/entities/userExam';
import { UserAnswer } from '../user/entities/userAnswer';
import { UserService } from '../user/user.service';
import { RedisModule } from '../redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, UserAnswer, UserExam]),
    RedisModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, JsonWebTokenStrategy, UserService],
})
export class TopicModule {}
