import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: './confirmation', // путь к шаблону письма
      context: {
        url,
      },
    });
  }

  generateVerificationToken() {
    return uuidv4();
  }
}