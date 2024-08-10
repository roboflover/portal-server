import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async sendMailOrder(mailOptions: { to: string; subject: string; text: string }) {
    const text = mailOptions.text
    await this.mailerService.sendMail({
      to: mailOptions.to,
      subject: 'Order Verification',
      template: './orderPrint',
      context: {
        text,
      },
    });
  }

  // sendMail(arg0: { to: string; subject: string; text: string; }) {
  //   throw new Error('Method not implemented.');
  // }

  async sendVerificationEmail(email: string, token: string) {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const backendUrl = configService.get('BACKEND_URL');
    const url = `${backendUrl}/email/verify?token=${token}`;
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

  async createVerificationToken(userId: number) {
    const token = this.generateVerificationToken();

    await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
      },
    });

    return token;
  }

  async verifyEmailToken(token: string) {
    
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    }); 

    // if (!verificationToken) {
    //   console.error('Токен не найден'); // <-- Логирование для отладки
    //   throw new Error('Invalid token');
    // }

    await this.prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return true;
  }

  async deleteVerifyToken(token: string){
    await this.prisma.emailVerificationToken.delete({
      where: {
        token,
      },
    });
  }
}

