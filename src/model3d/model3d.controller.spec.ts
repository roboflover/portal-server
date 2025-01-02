import { Test, TestingModule } from '@nestjs/testing';
import { Model3dController } from './model3d.controller';
import { Model3dService } from './model3d.service';

describe('Model3dController', () => {
  let controller: Model3dController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Model3dController],
      providers: [Model3dService],
    }).compile();

    controller = module.get<Model3dController>(Model3dController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
