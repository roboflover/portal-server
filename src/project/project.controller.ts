// src/Project/Project.controller.ts

import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import axios from 'axios';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly todoService: ProjectService,
    private readonly projectService: ProjectService,
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
        imageUrl = await this.projectService.uploadFile(file, title, description);
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
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.todoService.create(createProjectDto);
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
  update(@Param('id') id: string, @Body() updateProjectDto: CreateProjectDto) {
    return this.todoService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.todoService.deleteFileById(+id);
  }
}
