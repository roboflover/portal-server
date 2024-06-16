import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Project, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ProjectService {
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    this.bucket = process.env.S3_BUCKET;
  }

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title: string, description): Promise<string> {
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
  
      const project = await this.prisma.project.create({
        data: {
          title: title,
          description: description,
        },
      });

      if (!project) {
        throw new NotFoundException(`Project with title ${title} not found`);
      }
  
      await this.prisma.image.create({
        data: {
          url: imageUrl,
          projectId: project.id,
        },
      });
  
      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }

  }
  

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const project = await this.prisma.project.findUnique({
      where: { id: idAsNumber },
      include: { images: true }, // Включаем связанные изображения
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Удаляем все связанные изображения из S3 и базы данных
    for (const image of project.images) {
      const fileName = image.url.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      };

      await s3Client.send(new DeleteObjectCommand(params));
      await this.prisma.image.delete({ where: { id: image.id } });
    }

    // Удаляем запись Project из базы данных
    await this.prisma.project.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async findOne(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
      include: { images: true }, // Включаем связанные изображения
    });
  }

  async remove(id: number): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
}
