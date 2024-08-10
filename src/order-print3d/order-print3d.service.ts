import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderPrint3dDto } from './dto/create-order-print3d.dto';
import { EmailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class OrderPrint3dService {
  private bucket: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService, // Внедрение EmailService
  ) {
    this.bucket = process.env.S3_BUCKET_STL;
  }

  async uploadFile(file: Express.Multer.File, orderPrint3dData: CreateOrderPrint3dDto) {
    const newFileName = `model-${Date.now()}.stl`;

    const params = {
      Bucket: this.bucket,
      Key: newFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const fileSize = file.size;

      await s3Client.send(new PutObjectCommand(params));
      const modelUrl = `https://storage.yandexcloud.net/${this.bucket}/${newFileName}`;

      const orderDetails = {
        fileName: orderPrint3dData.fileName,
        orderDetails: orderPrint3dData.orderDetails, // Убедитесь, что это поле существует и передано в Body
        orderNumber: Number(orderPrint3dData.orderNumber),
        customerName: orderPrint3dData.customerName,
        customerEmail: orderPrint3dData.customerEmail,
        deliveryAddress: orderPrint3dData.deliveryAddress,
        customerPhone: orderPrint3dData.customerPhone,
        summa: Number(orderPrint3dData.summa),
        quantity: Number(orderPrint3dData.quantity),
        comment: orderPrint3dData.comment,
        fileSize: fileSize,
        modelUrl: modelUrl,
      };

      const orderPrint3d = await this.prisma.orderPrint3d.create({
        data: orderDetails,
      });

      if (!orderPrint3d) {
        throw new NotFoundException(`OrderPrint3d with title ${orderPrint3dData.orderNumber} not found`);
      }
      const orderDetailsString = JSON.stringify(orderDetails);

      await this.emailService.sendMailOrder({
        to: 'portal@robobug.ru',
        subject: `Новый заказ`,
        text: orderDetailsString,
      });

    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }


  async findOrderNumber(): Promise<number | null> {
    const lastOrder = await this.prisma.orderPrint3d.findFirst({
      orderBy: {
        orderNumber: 'desc',
      },
      select: {
        orderNumber: true,
      },
    });
    return lastOrder?.orderNumber || null;
  }

  async deleteFileById(id: string): Promise<void> {
    const idAsNumber = parseInt(id, 10);
    const orderPrint3d = await this.prisma.orderPrint3d.findUnique({
      where: { id: idAsNumber },
    });

    if (!orderPrint3d) {
      throw new NotFoundException(`OrderPrint3d with ID ${id} not found`);
    }

    // Удаляем соответствующий файл из S3, если `modelUrl` существует
    if (orderPrint3d.modelUrl) {
      const fileName = orderPrint3d.modelUrl.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName,
      }

      await s3Client.send(new DeleteObjectCommand(params));
    }

    // Удаляем запись OrderPrint3d из базы данных
    await this.prisma.orderPrint3d.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<CreateOrderPrint3dDto[]> {
    return this.prisma.orderPrint3d.findMany({
      orderBy: {
        id: 'desc', // сортировка по полю id в порядке убывания
      },
    });
  }

  async findOne(id: number): Promise<CreateOrderPrint3dDto | null> {
    return this.prisma.orderPrint3d.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.OrderPrint3dUpdateInput): Promise<CreateOrderPrint3dDto> {
    return this.prisma.orderPrint3d.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<CreateOrderPrint3dDto> {
    return this.prisma.orderPrint3d.delete({ where: { id } });
  }
}
