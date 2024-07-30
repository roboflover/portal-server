import { Controller } from '@nestjs/common';
import { OrderCatalogService } from './order-catalog.service';

@Controller('order-catalog')
export class OrderCatalogController {
  constructor(private readonly orderCatalogService: OrderCatalogService) {}
}
