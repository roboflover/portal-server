import { IsString, IsOptional, IsBoolean, IsInt, IsEmail, IsArray, ValidateNested, IsNumber } from 'class-validator';  
import { Prisma } from '@prisma/client';  
import { Type } from 'class-transformer'; 
  
export class CreateOrderPrint3dDto implements Prisma.OrderPrint3dCreateInput, Prisma.OrderPrint3dUpdateInput {  
    
  @IsNumber()
  summa: number

  @IsInt()
  quantity: number 

  @IsNumber()  
  orderNumber: number; 
 
  @IsString()  
  fileName: string; 

  @IsString()  
  fileSize: number; 

  @IsString()  
  orderDetails: string; 
 
  @IsString() 
  deliveryAddress: string; 
 
  @IsString() 
  customerName: string; 

  @IsString() 
  customerPhone: string; 
  
  @IsEmail() 
  customerEmail?: string; 
   
  @IsString() 
  orderStatus?: string; 
 
  @IsString() 
  @IsOptional() 
  comment?: string; 
 
  @IsString() 
  modelUrl?: string; 
 
} 