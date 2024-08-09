import { IsString, IsOptional, IsBoolean, IsDateString, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateReviewPrint3dDto implements Prisma.Review3dPrintCreateInput, Prisma.Review3dPrintUpdateInput {
  @IsInt()
  @IsOptional()
  id?: number; // ID необязателен для создания, но может быть использован для обновления

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsDateString()
  @IsOptional()
  date?: Date;
}