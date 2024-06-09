import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  findById(userId: number) {
    throw new Error('Method not implemented.');
  }
  constructor( private prisma: PrismaService ){}

  async getOneHundredUsers(){
    return this.prisma.user.findMany({take: 10})
  }

  async createUser(data: Prisma.UserCreateInput ): Promise<User> {
    return this.prisma.user.create({ data })
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique( { where: { email }} );
  }

  async getUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}