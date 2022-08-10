import { Module } from '@nestjs/common';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { QuestionType } from '../question/entities/question-type.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { Topic } from '../question/entities/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.user,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [User, Topic, QuestionType, Question, Answer],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class OrmModule {}
