// src/News/News.controller.ts

import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import axios from 'axios';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Интерцептор для обработки файла с ключом 'file'
  async uploadAndCreateTodo(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<void> {
    try {
      let imageUrl;
      if (file) {
        imageUrl = await this.newsService.uploadFile(file, title, description);
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
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }
 
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: CreateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.newsService.deleteFileById(id);
  }
}
