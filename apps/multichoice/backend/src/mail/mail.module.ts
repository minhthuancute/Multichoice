import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import configuration from '../config/configuration';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configuration().mail.user,
            pass: configuration().mail.password,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
