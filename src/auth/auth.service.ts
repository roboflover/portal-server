import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Invalid token');
    }
  
    const userId = user.id; // Извлекаем идентификатор пользователя
    const updateData = { isEmailVerified: true }; // Создаем объект данных для обновления
  
    await this.usersService.updateUser(userId, updateData); // Обновляем пользователя
  }

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

  async signIn(email: string, pass: string ): Promise<{ access_token: string; userId: number, role:string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.email };

    const info = await this.getUserProfile(user.id)
    const roleData = info.role

    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id,
      role: roleData,
    };
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async validatePassword(oldPassword: string, newPassword: string, userId: number): Promise<void> {
    // const { oldPassword, newPassword } = changePasswordDto;

    const isOldPasswordValid = await bcrypt.compare(oldPassword, newPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);

    await this.usersService.updatePassword(userId, hashedNewPassword);
  }
}
