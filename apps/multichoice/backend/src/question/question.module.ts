import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { TopicService } from '../topic/topic.service';
import { TopicModule } from '../topic/topic.module';
import { Topic } from './entities/topic.entity';
import { QuestionType } from './entities/question-type.entity';
import { Answer } from '../answer/entities/answer.entity';
import { JsonWebTokenStrategy } from '../auth/strategies/jwt-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Topic, QuestionType, Answer])],
  controllers: [QuestionController],
  providers: [QuestionService, TopicService, JsonWebTokenStrategy],
})
export class QuestionModule { }
