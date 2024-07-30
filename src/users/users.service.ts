import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async getOneHundredUsers() {
    return this.prisma.user.findMany({ take: 100 });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashPass = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashPass },
    });
  }

  async saveVerificationToken(userId: number, token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });

    await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
      },
    });
  }

  async findByVerificationToken(token: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          verificationToken: token,
        },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by verification token:', error);
      throw new Error('Unable to find user by verification token');
    }
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Unable to update user');
    }
  }
}
