import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsBoolean()
    published?: boolean

    @IsBoolean()
    authorId: number;
}

export class UpdatePostDto {
    @IsOptional()
    @IsNotEmpty()
    title?: string;
  
    @IsOptional()
    @IsNotEmpty()
    content?: string;
  
    @IsOptional()
    @IsBoolean()
    published?: boolean;
  }
  
  export class DeletePostDto {
    @IsNotEmpty()
    id: number;
  }