import { Test, TestingModule } from '@nestjs/testing';
import { OrderCatalogService } from './order-catalog.service';

describe('OrderCatalogService', () => {
  let service: OrderCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCatalogService],
    }).compile();

    service = module.get<OrderCatalogService>(OrderCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
