import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../s3client';
import * as dotenv from 'dotenv';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderPrint3dDto } from './dto/create-order-print3d.dto';
import { EmailService } from '../mail/mail.service';
import { Prisma, OrderPrint3d } from '@prisma/client';
import { date } from 'joi';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format } from 'date-fns';
import { toZonedTime, getTimezoneOffset } from 'date-fns-tz';

dotenv.config();

@Injectable()
export class OrderPrint3dService {
  private bucket: string;
  checkout: YooCheckout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {
    this.bucket = process.env.S3_BUCKET_STL;
    this.checkout = new YooCheckout({
      shopId: process.env.YOOKASSA_SHOP_ID,
      secretKey: process.env.YOOKASSA_SECRET_KEY
    });
  }

  async uploadFile(file: Express.Multer.File, orderPrint3dData: CreateOrderPrint3dDto) {
    const newFileName = `model-${Date.now()}.stl`;

    const params = {
      Bucket: this.bucket,
      Key: newFileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    function stringToBoolean(str) {
      return str.toLowerCase() === 'true';
    }
    

    try {
      const fileSize = file.size;
      await s3Client.send(new PutObjectCommand(params));
      const modelUrl = `https://storage.yandexcloud.net/${this.bucket}/${newFileName}`;

      const selfPickup = stringToBoolean(orderPrint3dData.selfPickup);

      const orderDetails = {
        fileName: orderPrint3dData.fileName,
        orderDetails: orderPrint3dData.orderDetails,
        orderNumber: orderPrint3dData.orderNumber,   // Преобразование к строке если необходимо
        customerName: orderPrint3dData.customerName,
        customerEmail: orderPrint3dData.customerEmail,
        deliveryAddress: orderPrint3dData.deliveryAddress,
        deliveryCity: orderPrint3dData.deliveryCity,
        // deliveryCoast: orderPrint3dData.deliveryCoast,
        selfPickup: selfPickup,
        customerPhone: orderPrint3dData.customerPhone,
        summa: Number(orderPrint3dData.summa),
        quantity: Number(orderPrint3dData.quantity),
        comment: orderPrint3dData.comment,
        fileSize: fileSize,
        modelUrl: modelUrl,
        material: orderPrint3dData.material,
        width: Number(orderPrint3dData.width),
        length: Number(orderPrint3dData.length),
        height: Number(orderPrint3dData.height),
        volume: Number(orderPrint3dData.volume),
        color: orderPrint3dData.color,
        orderStatus: orderPrint3dData.orderStatus,
        disable: orderPrint3dData.disable,
        paymentId: orderPrint3dData.paymentId,
        cdekEntityUuid: orderPrint3dData.cdekEntityUuid,
        creationTime: new Date(),
      };

      const orderPrint3d = await this.prisma.orderPrint3d.create({
        data: orderDetails
      });

      if (!orderPrint3d) {
        throw new NotFoundException(`OrderPrint3d with title ${orderPrint3dData.orderNumber} not found`);
      }

      const orderDetailsString = JSON.stringify(orderDetails);

      await this.emailService.sendMailOrder({
        to: 'portal@robobug.ru',
        subject: `Новый заказ`,
        text: orderDetailsString
      });

      await this.emailService.sendMailOrder({
        to: orderPrint3dData.customerEmail,
        subject: `Новый заказ`,
        text: `Здравствуйте! Вы зарегистрировали заказ на 3D печать. Отследить статус заказа можно тут: http://robobug.ru/print3d/my-orders`
      });

      setTimeout(() => {
        this.checkPaymentStatus(orderPrint3d.paymentId, orderPrint3d.id);
      }, 10 * 60 * 1000); // 10 minutes

    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }

  async checkPaymentStatus(paymentId: string, orderId: number) {
    try {
      const payment = await this.checkout.getPayment(paymentId);
      if (payment.status !== 'succeeded') {
        await this.deleteOrder(orderId);
      }
    } catch (error) {
      console.error('Error fetching payment information:', error);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkAllPendingOrders() {
    const pendingOrders = await this.prisma.orderPrint3d.findMany({
      where: {
        creationTime: {
          lt: new Date(Date.now() - 10 * 60 * 1000)  // older than 10 minutes
        },
        orderStatus: 'pending'
      }
    });

    for (const order of pendingOrders) {
      await this.checkPaymentStatus(order.paymentId, order.id);
    }
  }

  async deleteOrder(orderId: number) {
    try {
      await this.prisma.orderPrint3d.delete({
        where: { id: orderId }
      });
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }

  async findOrderNumber(): Promise<string> {
    const lastOrder = await this.prisma.orderPrint3d.findFirst({
      orderBy: {
        orderNumber: 'desc'
      },
      select: {
        orderNumber: true
      }
    });
    return lastOrder?.orderNumber || '';
  }

  async deleteFileById(id: number): Promise<void> {
    const idAsNumber = Number(id);
    const orderPrint3d = await this.prisma.orderPrint3d.findUnique({
      where: { id: idAsNumber }
    });

    if (!orderPrint3d) {
      throw new NotFoundException(`OrderPrint3d with ID ${id} not found`);
    }

    if (orderPrint3d.modelUrl) {
      const fileName = orderPrint3d.modelUrl.split('/').pop();
      const params = {
        Bucket: this.bucket,
        Key: fileName
      };

      await s3Client.send(new DeleteObjectCommand(params));
    }

    await this.prisma.orderPrint3d.delete({ where: { id: idAsNumber } });
  }

  async findAll(): Promise<OrderPrint3d[]> {
    return this.prisma.orderPrint3d.findMany({
      orderBy: {
        id: 'desc'
      }
    });
  }

  async findOne(id: number): Promise<OrderPrint3d | null> {
    return this.prisma.orderPrint3d.findUnique({
      where: { id }
    });
  }

  async update(id: number, data: Prisma.OrderPrint3dUpdateInput): Promise<OrderPrint3d> {
    return this.prisma.orderPrint3d.update({
      where: { id },
      data
    });
  }

  async remove(id: number): Promise<OrderPrint3d> {
    return this.prisma.orderPrint3d.delete({ where: { id } });
  }

  async getOrdersByEmail(email: string) {
    const orders = await this.prisma.orderPrint3d.findMany({
      where: { customerEmail: email }
    });

    return orders;
  }

  async updateOrderStatus(id: number, newStatus: string): Promise<OrderPrint3d> {
    const order = await this.prisma.orderPrint3d.findUnique({
      where: { id }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.orderPrint3d.update({
      where: { id: order.id },
      data: { orderStatus: newStatus }
    });
  }
}