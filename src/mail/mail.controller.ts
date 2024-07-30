import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { EmailService } from './mail.service';
import { Response } from 'express';
import { EmailVerificationGuard } from './mail-verification.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService,
  ) {}

  @UseGuards(EmailVerificationGuard) 
  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const isValidToken = await this.emailService.verifyEmailToken(token)
      if(isValidToken){
        res.redirect('https://robobug.ru/registerSuccess'); 
        await this.emailService.deleteVerifyToken(token)
      }
      // Redirect to success page
    } catch (error) {
      return res.status(400).send('Invalid or expired token');
    }
  }

}