import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Catalog, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class CatalogService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.CatalogCreateInput): Promise<Catalog> {
    return this.prisma.catalog.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File, 
    title: string,  
    description: string, 
    price: number, 
    isPinned: boolean, 
    links: string[]): Promise<string> {
      const resizedBuffer = await sharp(file.buffer)
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
  
      const catalog = await this.prisma.catalog.create({
        data: {
          title: title,
          description: description,
          isPinned: isPinned,
          links: links
        },
      });

      if (!catalog) {
        throw new NotFoundException(`Catalog with title ${title} not found`);
      }
  
      await this.prisma.image.create({
        data: {
          url: imageUrl,
          catalogId: catalog.id,
        },
      });
  
      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

  }
  

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const catalog = await this.prisma.catalog.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!catalog) {
      throw new NotFoundException(`Catalog with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of catalog.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.image.delete({ where: { id: image.id } });
    }

    // Удаляем запись Catalog из базы данных
    await this.prisma.catalog.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<Catalog[]> {
    return this.prisma.catalog.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<Catalog | null> {
    return this.prisma.catalog.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async update(id: number, data: Prisma.CatalogUpdateInput): Promise<Catalog> {
    return this.prisma.catalog.update({
      where: { id },
      data,
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async remove(id: number): Promise<Catalog> {
    return this.prisma.catalog.delete({ where: { id } });
  }
}
