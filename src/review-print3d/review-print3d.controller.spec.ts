// src/review-print3d.controller/review-print3d.controller.ts

import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReviewPrint3dService } from './review-print3d.service';
import { CreateReviewPrint3dDto } from './dto/create-review-print3d.dto';

@Controller('review-print3d')
export class ReviewPrint3dController {
  constructor(                             
    private readonly reviewPrint3dService: ReviewPrint3dService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Интерцептор для обработки файла с ключом 'file'
  async uploadAndCreateReview(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<void> {
    try {
      let imageUrl;
      if (file) {
        imageUrl = await this.reviewPrint3dService.uploadFile(file, title, description);
        console.log(`Файл загружен успешно. URL изображения: ${imageUrl}`);
      } else {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      console.error('Ошибка при загрузке файла или создании отзыва:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  create(@Body() createReviewPrint3dDto: CreateReviewPrint3dDto) {
    return this.reviewPrint3dService.create(createReviewPrint3dDto);
  }

  @Get()
  findAll() {
    return this.reviewPrint3dService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reviewPrint3dService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewPrint3dDto: CreateReviewPrint3dDto) {
    return this.reviewPrint3dService.update(+id, updateReviewPrint3dDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.reviewPrint3dService.deleteFileById(id);
  }
}