import { Get, Request, Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
   ) {}

  @Get('getOneHundredUsers')
  getOneHundredUsers(){
    return this.authService.getOneHundredUsers()
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')  
  async registerUser(@Body() authDto: AuthDto){
    const user = await this.authService.createUser(authDto.name, authDto.email, authDto.password );
    return { message: 'User registered successfully', user };
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
}