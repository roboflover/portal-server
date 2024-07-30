import { Module } from '@nestjs/common';
import { OrderPrint3dService } from './order-print3d.service';
import { OrderPrint3dController } from './order-print3d.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [OrderPrint3dController],
  providers: [OrderPrint3dService, PrismaService],
})
export class OrderPrint3dModule {}
