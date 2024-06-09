import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  name: string;
  

  // Другие поля пользователя
}
