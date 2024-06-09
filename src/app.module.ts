import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    CatsModule, 
    AuthModule, 
    UsersModule, 
    PostModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FRONTEND_URL: Joi.string(),
      }),
    })
  ],
})
export class AppModule {}