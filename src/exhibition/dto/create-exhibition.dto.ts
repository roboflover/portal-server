import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateExhibitionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  // @IsString()
  // date: string


}