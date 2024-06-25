import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Old password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Old password must be at most 20 characters long' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(20, { message: 'New password must be at most 20 characters long' })
  @Matches(/(?=.*[A-Z])/, { message: 'New password must contain at least one uppercase letter' })
  @Matches(/(?=.*[a-z])/, { message: 'New password must contain at least one lowercase letter' })
  @Matches(/(?=.*[0-9])/, { message: 'New password must contain at least one number' })
  newPassword: string;
}
