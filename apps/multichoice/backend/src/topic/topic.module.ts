import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '../question/entities/topic.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService, JsonWebTokenStrategy]
})
export class TopicModule { }
