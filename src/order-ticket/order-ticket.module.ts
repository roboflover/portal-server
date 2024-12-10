import { Module } from '@nestjs/common';
import { OrderTicketService } from './order-ticket.service';
import { OrderTicketController } from './order-ticket.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrderTicketController],
  providers: [OrderTicketService, PrismaService, ConfigService],
})
export class OrderTicketModule {}
