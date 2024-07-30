// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      console.error('No token provided');
      throw new UnauthorizedException('No token provided');
    }
    try { 
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret,
        }
      );

      request['user'] = payload;
    } catch (err) {
      console.error('Invalid token!', err.message);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractToken(request: any): string | null {
    // Extract token from header
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    
    // Extract token from query parameter
    if (request.query && request.query.token) {
      return request.query.token;
    }

    return null;
  }
}
