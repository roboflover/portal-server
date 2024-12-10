import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Интерцептор для обработки файла с ключом 'file'
  async uploadAndCreateTodo(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateTicketDto,
  ): Promise<void> {
    try {
      let imageUrl;
      if (file) {
        console.log('data', data)
        imageUrl = await this.ticketsService.uploadFile(file, data);
        console.log(`Файл загружен успешно. URL изображения: ${imageUrl}`);
      } else {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      console.error('Ошибка при загрузке файла или создании todo:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }   
  }
  
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.ticketsService.deleteFileById(id);
  }
}
