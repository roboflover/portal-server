import { Test, TestingModule } from '@nestjs/testing';
import { OrderCatalogController } from './order-catalog.controller';
import { OrderCatalogService } from './order-catalog.service';

describe('OrderCatalogController', () => {
  let controller: OrderCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCatalogController],
      providers: [OrderCatalogService],
    }).compile();

    controller = module.get<OrderCatalogController>(OrderCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
