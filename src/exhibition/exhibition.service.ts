import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Exhibition, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ExhibitionService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.ExhibitionCreateInput): Promise<Exhibition> {
    return this.prisma.exhibition.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title: string): Promise<string> {
    const resizedBuffer = await sharp(file.buffer)
      .resize(800, 600) // Измените размеры по вашему усмотрению
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
  
      const exhibition = await this.prisma.exhibition.create({
        data: {
          title: title,
        },
      });

      if (!exhibition) {
        throw new NotFoundException(`Exhibition with title ${title} not found`);
      }
  
      await this.prisma.image.create({
        data: {
          url: imageUrl,
          exhibitionId: exhibition.id,
        },
      });
  
      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

  }
  

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const exhibition = await this.prisma.exhibition.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!exhibition) {
      throw new NotFoundException(`Exhibition with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of exhibition.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.image.delete({ where: { id: image.id } });
    }

    // Удаляем запись Exhibition из базы данных
    await this.prisma.exhibition.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<Exhibition[]> {
    return this.prisma.exhibition.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<Exhibition | null> {
    return this.prisma.exhibition.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async update(id: number, data: Prisma.ExhibitionUpdateInput): Promise<Exhibition> {
    return this.prisma.exhibition.update({
      where: { id },
      data,
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async remove(id: number): Promise<Exhibition> {
    return this.prisma.exhibition.delete({ where: { id } });
  }
}
