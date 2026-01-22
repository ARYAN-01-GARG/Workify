import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { config } from 'src/common/config';
import { MailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: config.mail.smtp,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
