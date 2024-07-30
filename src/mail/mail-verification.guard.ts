import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from '../mail/mail.service'; 
 
@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private emailService: EmailService) {}
 
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = request.query.token;
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
 
    try {
      const isValid = await this.emailService.verifyEmailToken(token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}