import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrderPrint3dService } from './order-print3d.service';
import { CreateOrderPrint3dDto } from './dto/create-order-print3d.dto';
import { OrderDetails } from './interfaces/OrderDetails';

@Controller('order-print3d')
export class OrderPrint3dController {
  constructor(
    private readonly orderPrint3dService: OrderPrint3dService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndCreateOrder(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateOrderPrint3dDto,
  ): Promise<void> {
    try {

      if (!file) {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }
      await this.orderPrint3dService.uploadFile(file, data)

    } catch (error) {
      console.error('Ошибка при загрузке файла или создании заказа на печать:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }   
  }

  @Get('orderNumber')
  findOrderNumber() {
    return this.orderPrint3dService.findOrderNumber();
  }
 
  @Get()
  findAll() {
    return this.orderPrint3dService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderPrint3dService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderPrint3dDto: CreateOrderPrint3dDto) {
    return this.orderPrint3dService.update(+id, updateOrderPrint3dDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.orderPrint3dService.deleteFileById(id);
  }
}