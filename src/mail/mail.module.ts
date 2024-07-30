import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from './mail.service';
import { EmailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false,
        auth: {
          user: 'portal@robobug.ru',
          pass: 'iuykebrfalfwiipf',
        },
      },
      defaults: {
        from: '"No Reply" <portal@robobug.ru>',
      },
      template: {
        dir: join(process.cwd(), 'src', 'templates'), // Абсолютный путь к папке с шаблонами
        adapter: new HandlebarsAdapter(), // или другой адаптер шаблонов
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
  ],
  providers: [EmailService, PrismaService ],
  controllers: [EmailController],
  exports: [EmailService],
})
export class MailModule {}

   