import { IsString, IsOptional, IsBoolean, IsInt, IsNumber } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateTicketDto implements Prisma.TicketCreateInput, Prisma.TicketUpdateInput {

  @IsInt()
  id: number; // ID обязателен для обновления

  @IsString()
  title: string;

  @IsNumber()
  price?: string

  @IsNumber()
  @IsOptional()
  oldPrice?: number

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string

  @IsString()
  @IsOptional()
  promocode?: string

  @IsString()
  @IsOptional()
  paymentId?: string

  @IsBoolean()
  @IsOptional()
  isDelete?: boolean

}