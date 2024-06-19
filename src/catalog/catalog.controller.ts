// src/catalog/catalog.controller.ts

import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import axios from 'axios';

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly todoService: CatalogService,
    private readonly catalogService: CatalogService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Интерцептор для обработки файла с ключом 'file'
  async uploadAndCreateTodo(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('isPinned') isPinned: boolean,
    @Body('links') links: string[],
  ): Promise<void> {
    try {
      if (file) {
        await this.catalogService.uploadFile(file, title, description, price, isPinned, links );
      } else {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла или создании todo:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }   
  }

  @Post()
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.todoService.create(createCatalogDto);
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
  update(@Param('id') id: number, @Body() updateCatalogDto: CreateCatalogDto) {
    return this.todoService.update(id, updateCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.todoService.deleteFileById(id);
    //return this.todoService.remove(+id);
  }
}
