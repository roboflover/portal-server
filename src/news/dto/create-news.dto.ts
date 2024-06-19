import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateNewsDto implements Prisma.NewsCreateInput, Prisma.NewsUpdateInput {
  // name?: string;
  // createdAt?: string | Date;
  // updatedAt?: string | Date;
  
  @IsInt()
  id: number; // ID обязателен для обновления

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  imageUrl: string


}