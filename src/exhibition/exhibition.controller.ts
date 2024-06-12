// src/exhibition/exhibition.controller.ts

import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import axios from 'axios';

@Controller('exhibition')
export class ExhibitionController {
  constructor(
    private readonly todoService: ExhibitionService,
    private readonly exhibitionService: ExhibitionService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Интерцептор для обработки файла с ключом 'file'
  async uploadAndCreateTodo(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
  ): Promise<void> {
    try {
      let imageUrl;
      if (file) {
        imageUrl = await this.exhibitionService.uploadFile(file, title);
        // console.log(Файл загружен успешно. URL изображения: ${imageUrl});
      } else {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      console.error('Ошибка при загрузке файла или создании todo:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }   
  }

  @Post()
  create(@Body() createExhibitionDto: CreateExhibitionDto) {
    return this.todoService.create(createExhibitionDto);
  }
 
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateExhibitionDto: CreateExhibitionDto) {
    return this.todoService.update(id, updateExhibitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.todoService.deleteFileById(id);
    //return this.todoService.remove(+id);
  }
}
