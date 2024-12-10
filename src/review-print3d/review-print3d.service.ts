import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Review3dPrint, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ReviewPrint3dService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.Review3dPrintCreateInput): Promise<Review3dPrint> {
    return this.prisma.review3dPrint.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title: string, description: string): Promise<string> {
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

      const review = await this.prisma.review3dPrint.create({
        data: {
          title: title,
          description: description,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review with title ${title} not found`);
      }

      await this.prisma.reviewImage.create({
        data: {
          url: imageUrl,
          reviewId: review.id,
        },
      });

      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const review = await this.prisma.review3dPrint.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of review.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.reviewImage.delete({ where: { id: image.id } });
    }

    // Удаляем запись Review из базы данных
    await this.prisma.review3dPrint.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<Review3dPrint[]> {
    return this.prisma.review3dPrint.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<Review3dPrint | null> {
    return this.prisma.review3dPrint.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async update(id: number, data: Prisma.Review3dPrintUpdateInput): Promise<Review3dPrint> {
    return this.prisma.review3dPrint.update({
      where: { id },
      data,
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async remove(id: number): Promise<Review3dPrint> {
    return this.prisma.review3dPrint.delete({ where: { id } });
  }
}
