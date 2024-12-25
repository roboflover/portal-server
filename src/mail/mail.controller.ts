import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { EmailService } from './mail.service';
import { Response } from 'express';
import { EmailVerificationGuard } from './mail-verification.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UseGuards(EmailVerificationGuard)
  @Get('verify')
  async verifyEmail(@Req() req: any, @Res() res: Response) {
    try {
      // Получаем токен, который был проверен в Guard
      const validatedToken = req.validatedToken;
      console.log('validatedToken', validatedToken)
      // Возвращаем статус 200 с сообщением и токеном
      return res.status(200).json({
        message: 'Email verification successful',
        token: validatedToken,
      });
    } catch (error) {
      // В случае ошибки отправляем соответствующий статус и сообщение
      return res.status(400).json({
        message: 'Email verification failed',
        error: error.message,
      });
    }
  }
}
