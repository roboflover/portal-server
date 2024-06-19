import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ProductService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
        price: data.price,
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
      .resize(1280, 1024) // Измените размеры по вашему усмотрению
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
  
      const product = await this.prisma.product.create({
        data: {
          title: title,
          description: description,
          price: price,
          isPinned: isPinned,
          links: links
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with title ${title} not found`);
      }
  
      await this.prisma.image.create({
        data: {
          url: imageUrl,
          productId: product.id,
        },
      });
  
      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

  }
  

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const product = await this.prisma.product.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of product.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.image.delete({ where: { id: image.id } });
    }

    // Удаляем запись Product из базы данных
    await this.prisma.product.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async updateProductById(id: string, updateProductDto): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const product = await this.prisma.product.findUnique({
      where: { id: idAsNumber },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // Обновляем запись продукта в базе данных
    await this.prisma.product.update({
      where: { id: idAsNumber },
      data: {
        title: updateProductDto.title,
        description: updateProductDto.description,
        price: updateProductDto.price,
      },
    });

    return updateProductDto

  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
