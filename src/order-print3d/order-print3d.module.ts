import { Module } from '@nestjs/common';
import { OrderPrint3dService } from './order-print3d.service';
import { OrderPrint3dController } from './order-print3d.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';  
import { ConfigService } from '@nestjs/config';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [MailModule, BotModule],  
  controllers: [OrderPrint3dController],
  providers: [OrderPrint3dService, PrismaService, ConfigService],
})
export class OrderPrint3dModule {}