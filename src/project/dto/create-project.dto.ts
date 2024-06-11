import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateProjectDto implements Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput {
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