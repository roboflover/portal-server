import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ticket, Prisma } from '@prisma/client'
import { s3Client } from 'src/s3client';
import { CreateTicketDto } from 'src/tickets/dto/create-ticket.dto'
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TicketsService {
    private bucket: string;

    constructor(private readonly prisma: PrismaService,
    ){
      this.bucket = process.env.S3_BUCKET;
    }

    async uploadFile(file: Express.Multer.File, сreateTicketDto: CreateTicketDto): Promise<string> { 

        // Проверяем входной файл
        if (!file || !file.buffer) {
          throw new Error('Файл не найден или пустой');
        }
        console.log('сreateTicketDto', сreateTicketDto)

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
          console.log('сreateTicketDto', сreateTicketDto)
          
          const tickets = await this.prisma.ticket.create({
            data: {
              title: сreateTicketDto.title,
              description: сreateTicketDto.description,
              price: сreateTicketDto.price,
              imageUrl: imageUrl

            },
          });
    
          if (!tickets) {
            throw new NotFoundException(`tickets with title ${сreateTicketDto.title} not found`);
          }
      
      
          return imageUrl;
        } catch (error) {
          throw new Error(`Ошибка при загрузке файла: ${error.message}`);
        }
    
      }

      async findAll(): Promise<Ticket[]> {
        return this.prisma.ticket.findMany({
          orderBy: {
            id: 'desc', // сортировка по полю id в порядке убывания
          },
          // include: { images: true }, // Включаем связанные изображения
        });
      }

      // async update(id: number, сreateTicketDto: CreateTicketDto): Promise<Ticket> {
      //   return this.prisma.news.update({
      //     where: { id },
      //     data,
      //     // include: { images: true }, // Включаем связанные изображения
      //   });
      // }
    
      async deleteFileById(id: string): Promise<void> {
        const idAsNumber = parseInt(id, 10);
        const ticket = await this.prisma.ticket.findUnique({
          where: { id: idAsNumber },
          // include: { images: true }, // Включаем связанные изображения
        });
    
        if (!ticket) {
          throw new NotFoundException(`ticket with ID ${id} not found`);
        }
    
        // Удаляем все связанные изображения из S3 и базы данных
        //for (const image of news.images) {
          if(ticket.imageUrl){
          const fileName = ticket.imageUrl.split('/').pop();

          const params = {
            Bucket: this.bucket,
            Key: fileName,
          };
   
          await s3Client.send(new DeleteObjectCommand(params));
        }
        await this.prisma.ticket.delete({ where: { id: idAsNumber } });
      }
    
}

