import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import * as sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { Exhibition, Prisma } from '@prisma/client';
import * as fs from 'fs';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ExhibitionService {
  // private s3Client: s3Client;
  private bucket: string;

  constructor(private readonly prisma: PrismaService) {
    // this.s3Client = new s3Client({ region: 'your-region' });
    this.bucket = process.env.S3_BUCKET;
    }
 
  async create(data: Prisma.ExhibitionCreateInput): Promise<Exhibition> {
    return this.prisma.exhibition.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, title:string ): Promise<string> {
    // Получаем последний номер из базы данных
    const lastImage = await this.prisma.exhibition.findFirst({
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
      await this.prisma.exhibition.create({
        data: {
          title: title,
          imageUrl: imageUrl,
        },
      });

      return imageUrl;
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }

  async deleteFileById(id: string): Promise<void> {
    // Получаем запись из базы данных по ID
    const str: string = String(id);
    const idAsNumber = parseInt(id, 10);
    const exhibition = await this.prisma.exhibition.findUnique({ where: { id:idAsNumber }  });
    //this.prisma.exhibition.delete({ where: { id:idAsNumber } });
    
    if (!exhibition) {
      throw new NotFoundException(`Exhibition with ID ${id} not found`);
    }

    const imageUrl = exhibition.imageUrl //`https://storage.yandexcloud.net/${this.bucket}/`;
    const fileName = imageUrl.split('/').pop();

    const params = {
      Bucket: this.bucket,
      Key: fileName,
    };

    try {
      // Удаляем файл из S3
      await s3Client.send(new DeleteObjectCommand(params));

      // Удаляем запись из базы данных
      await this.prisma.exhibition.delete({
        where: { id:idAsNumber },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при удалении файла: ${error.message}`);
    }
  }
  
    //constructor(private prisma: PrismaService) {}

  // async create(data: Prisma.TodoCreateInput): Promise<Todo> {
  //   return this.prisma.todo.create({ data });
  // }

  async findAll(): Promise<Exhibition[]> {
    return this.prisma.exhibition.findMany();
  }

  async findOne(id: number): Promise<Exhibition | null> {
    return this.prisma.exhibition.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.ExhibitionUpdateInput): Promise<Exhibition> {
    return this.prisma.exhibition.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Exhibition> {
    return this.prisma.exhibition.delete({ where: { id } });
  }
  
}


