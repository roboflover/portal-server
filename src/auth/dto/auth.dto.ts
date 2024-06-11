import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PROMOTER = 'promoter'
}

export class AuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Role must be either admin or user' })
  role: UserRole;

}


