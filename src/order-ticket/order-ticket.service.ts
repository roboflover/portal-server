import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderTicketDto } from './dto/create-order-ticket.dto';
// import { UpdateOrderTicketDto } from './dto/update-order-ticket.dto';
// import { Prisma, OrderTicket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderTicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderTicketDto) {
    try {
      // Сохраняем данные в базе через Prisma
      await this.prisma.orderTicket.create({
        data: {
          paymentId: data.paymentId,
          title: data.title,
          price: data.price, // Преобразуем строку в число, если нужно
          description: data.description,
        },
      });
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

    return 'This action adds a new orderTicket';
  }
}