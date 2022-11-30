import { Module } from '@nestjs/common';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { Topic } from '../topic/entities/topic.entity';
import { UserAnswer } from '../userAnswer/entities/userAnswer.entity';
import { UserExam } from '../userExam/entities/userExam.entity';
import { Group } from '../group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.user,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [User, Topic, Question, Answer, UserAnswer, UserExam, Group],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class OrmModule {}
