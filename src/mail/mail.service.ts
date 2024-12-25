import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      subject: 'Новый заказ на 3D печать!',
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
    const frontUrl = configService.get('FRONTEND_URL');
    const url = `${frontUrl}/email/verify?token=${token}`;
    console.log('url', url)

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

  

  async verifyEmailToken(token: string): Promise<boolean> {
    // Логируем входящий токен
    console.log('Received token:', token);
  
    // Ищем токен в базе данных
    console.log('Searching for token in database...');
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
  
    // Если токен не найден, выбрасываем ошибку
    if (!verificationToken) {
      console.error('Token not found or expired:', token);
      throw new NotFoundException('Invalid or expired token');
    }
    console.log('Token found:', verificationToken);
  
    // Обновляем статус пользователя
    console.log('Updating user email verification status...');
    await this.prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });
    console.log('User email verification status updated for userId:', verificationToken.userId);
  
    // Удаляем использованный токен
    console.log('Deleting used token...');
    await this.prisma.emailVerificationToken.delete({
      where: { token },
    });
    console.log('Token deleted:', token);
  
    console.log('Email verification process completed successfully.');
    return true;
  }

  



  async deleteVerifyToken(token: string){
    await this.prisma.emailVerificationToken.delete({
      where: {
        token,
      },
    });
  }

  async markEmailAsVerified(token: string): Promise<void> {
    // Находим пользователя по токену
    // const user = await this.prisma.user.findUnique({
    //   where: { verificationToken: token },
    // });

    // if (!user) {
    //   throw new Error('Пользователь с таким токеном не найден');
    // }

    // // Обновляем поле isEmailVerified и удаляем токен
    // await this.prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     isEmailVerified: true,
    //     verificationToken: null, // Удаляем токен после верификации
    //   },
    // });
  }

}

