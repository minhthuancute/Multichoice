import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from './dto/mail.dto';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(data: MailDto): Promise<void> {
    await this.mailerService.sendMail(data);
  }
}
