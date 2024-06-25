import { Get, Request, Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Param, ParseIntPipe, BadRequestException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/mail/mail.service';
import { User } from '@prisma/client';
//import { ChangePasswordDto } from './dto/change-password.dto'

class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private emailService: EmailService
   ) {}

  @Get('getOneHundredUsers')
  getOneHundredUsers(){
    return this.authService.getOneHundredUsers()
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerUser(@Body() authDto: AuthDto){
    const user = await this.authService.createUser(authDto.name, authDto.email, authDto.password );
    const token = this.emailService.generateVerificationToken();
    await this.usersService.saveVerificationToken(user.id, token);
    await this.emailService.sendVerificationEmail(user.email, token);
    return { message: 'Registration successful. Please check your email.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto.email, authDto.password );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    return  this.usersService.getUser(req.user.sub); //req.user
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.usersService.getUser(id);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    console.log('auth.controller/verify-email @get')
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {

    const { oldPassword, newPassword } = changePasswordDto;
    const userId = req.user.sub;
    const user = await this.usersService.getUser(userId);
    
    await this.authService.validatePassword(oldPassword, newPassword, userId)

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersService.updatePassword(userId, newPassword);

    return { message: 'Password changed successfully' };
  }

}
