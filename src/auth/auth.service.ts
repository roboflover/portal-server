import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async getOneHundredUsers() {
    return await this.usersService.getOneHundredUsers();
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string; userId: number }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id,
    };
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
