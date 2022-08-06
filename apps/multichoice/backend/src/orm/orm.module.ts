import { Module } from '@nestjs/common';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.user,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class OrmModule {}
