import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../question/entities/topic.entity';
import { UserExam } from './entities/userExam';
import { UserAnswer } from './entities/userAnswer';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, UserExam, UserAnswer]),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService, JsonWebTokenStrategy, TopicService],
})
export class UserModule {}
