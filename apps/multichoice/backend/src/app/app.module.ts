import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { OrmModule } from '../orm/orm.module';
import { AuthModule } from '../auth/auth.module';
import { QuestionModule } from '../question/question.module';
import { TopicModule } from '../topic/topic.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    OrmModule,
    UserModule,
    AuthModule,
    QuestionModule,
    TopicModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
