import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderTicketDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    price?: string;
  
    @IsOptional()
    @IsString()
    paymentId?: string;
  
    @IsOptional()
    @IsBoolean()
    isDelete?: boolean;

    @IsOptional()
    @IsNumber()
    count?: number;
  }
  