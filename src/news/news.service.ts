import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { News, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class NewsService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.NewsCreateInput): Promise<News> {
    return this.prisma.news.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title: string, description): Promise<string> {
    const resizedBuffer = await sharp(file.buffer)
      .rotate() 
      .resize(1280, 1024, {
        fit: 'cover', 
        position: 'center' 
      })
      .toBuffer();

      const newFileName = `image-${Date.now()}.jpg`;
  
    const params = {
      Bucket: this.bucket,
      Key: newFileName,
      Body: resizedBuffer,
      ContentType: file.mimetype,
    };
  
    try {
      await s3Client.send(new PutObjectCommand(params));
      const imageUrl = `https://storage.yandexcloud.net/${this.bucket}/${newFileName}`;
  
      const news = await this.prisma.news.create({
        data: {
          title: title,
          description: description,
        },
      });

      if (!news) {
        throw new NotFoundException(`News with title ${title} not found`);
      }
  
      await this.prisma.image.create({
        data: {
          url: imageUrl,
          newsId: news.id,
        },
      });
  
      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

  }
  

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const news = await this.prisma.news.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of news.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.image.delete({ where: { id: image.id } });
    }

    // Удаляем запись News из базы данных
    await this.prisma.news.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<News[]> {
    return this.prisma.news.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<News | null> {
    return this.prisma.news.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async update(id: number, data: Prisma.NewsUpdateInput): Promise<News> {
    return this.prisma.news.update({
      where: { id },
      data,
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async remove(id: number): Promise<News> {
    return this.prisma.news.delete({ where: { id } });
  }
}
