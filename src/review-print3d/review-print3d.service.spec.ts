import { Test, TestingModule } from '@nestjs/testing';
import { ReviewPrint3dService } from './review-print3d.service';

describe('ReviewPrint3dService', () => {
  let service: ReviewPrint3dService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewPrint3dService],
    }).compile();

    service = module.get<ReviewPrint3dService>(ReviewPrint3dService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
