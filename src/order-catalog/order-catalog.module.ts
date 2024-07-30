import { Module } from '@nestjs/common';
import { OrderCatalogService } from './order-catalog.service';
import { OrderCatalogController } from './order-catalog.controller';

@Module({
  controllers: [OrderCatalogController],
  providers: [OrderCatalogService],
})
export class OrderCatalogModule {}
