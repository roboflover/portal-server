import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateExhibitionDto implements Prisma.ExhibitionCreateInput, Prisma.ExhibitionUpdateInput {
  
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