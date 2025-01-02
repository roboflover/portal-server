import { Test, TestingModule } from '@nestjs/testing';
import { Model3dService } from './model3d.service';

describe('Model3dService', () => {
  let service: Model3dService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Model3dService],
    }).compile();

    service = module.get<Model3dService>(Model3dService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
