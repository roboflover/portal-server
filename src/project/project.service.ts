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
  // private s3Client: s3Client;
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {

    this.bucket = process.env.S3_BUCKET;
    }
 
  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title:string, description:string ): Promise<string> {
    // Получаем последний номер из базы данных
    const lastImage = await this.prisma.project.findFirst({
      orderBy: { id: 'desc' },
    });
    const newId = lastImage ? lastImage.id + 1 : 1;
    const newFileName = `image-${newId}.jpg`;

    const resizedBuffer = await sharp(file.buffer)
      .resize(800, 600) // Измените размеры по вашему усмотрению
      .toBuffer();

    const params = {
      Bucket: this.bucket,
      Key: newFileName,
      Body: resizedBuffer,
      ContentType: file.mimetype,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      const imageUrl = `https://storage.yandexcloud.net/${this.bucket}/${newFileName}`;
      //Сохраняем URL и title в базу данных
      await this.prisma.project.create({
        data: {
          title: title,
          imageUrl: imageUrl,
          description: description
        },
      });

      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }

  async deleteFileById(id: number): Promise<void> {
    // Получаем запись из базы данных по ID
    const str: string = String(id);
    //const idAsNumber = parseInt(id, 10);
    const project = await this.prisma.project.findUnique({ where: { id }  });
    //this.prisma.project.delete({ where: { id:idAsNumber } });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const imageUrl = project.imageUrl //`https://storage.yandexcloud.net/${this.bucket}/`;
    const fileName = imageUrl.split('/').pop();

    const params = {
      Bucket: this.bucket,
      Key: fileName,
    };

    try {
      // Удаляем файл из S3
      await s3Client.send(new DeleteObjectCommand(params));

      // Удаляем запись из базы данных
      await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при удалении файла: ${error.message}`);
    }
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
  
}


