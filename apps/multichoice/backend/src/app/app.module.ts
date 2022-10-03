import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { OrmModule } from '../orm/orm.module';
import { AuthModule } from '../auth/auth.module';
import { QuestionModule } from '../question/question.module';
import { TopicModule } from '../topic/topic.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    OrmModule,
    UserModule,
    AuthModule,
    QuestionModule,
    TopicModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
