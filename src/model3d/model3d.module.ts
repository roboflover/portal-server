import { Module } from '@nestjs/common';
import { Model3dService } from './model3d.service';
import { Model3dController } from './model3d.controller';

@Module({
  controllers: [Model3dController],
  providers: [Model3dService],
})
export class Model3dModule {}
