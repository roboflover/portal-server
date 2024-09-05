import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEmail,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateOrderPrint3dDto implements Prisma.OrderPrint3dCreateInput, Prisma.OrderPrint3dUpdateInput {
  
  @IsInt()
  id: number;

  @IsNumber()
  @IsOptional()
  orderNumber?: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  summa: number;

  @IsNumber()
  fileSize: number;
  
  @IsString()
  fileName: string;

  @IsString()
  material: string;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;

  @IsNumber()
  height: number;

  @IsNumber()
  volume: number;

  @IsNumber()
  color: string;

  @IsString()
  @IsOptional()
  orderDetails?: string;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  deliveryCity?: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  customerPhone: string;

  @IsString()
  orderStatus: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  modelUrl?: string;

  @IsBoolean()
  @IsOptional()
  disable?: boolean;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  cdekEntityUuid?: string;

  @IsString()
  @IsOptional()
  creationTime?: string;  

}