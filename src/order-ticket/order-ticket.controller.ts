import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException, Query } from '@nestjs/common';
import { OrderTicketService } from './order-ticket.service';
import { CreateOrderTicketDto } from './dto/create-order-ticket.dto';
import { UpdateOrderTicketDto } from './dto/update-order-ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('order-ticket')
export class OrderTicketController {
  constructor(private readonly orderTicketService: OrderTicketService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Если вы ожидаете файл (можно убрать, если файлов нет)
  async uploadAndCreateOrder(
    @UploadedFile() file: Express.Multer.File, // Если файл передается
    @Body() data: CreateOrderTicketDto,
  ): Promise<void> {
    console.log('Received data:', data);

    try {
      await this.orderTicketService.create(data);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
