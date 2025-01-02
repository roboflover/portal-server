import { Injectable } from '@nestjs/common';
import { CreateModel3dDto } from './dto/create-model3d.dto';
import { UpdateModel3dDto } from './dto/update-model3d.dto';

@Injectable()
export class Model3dService {
  create(createModel3dDto: CreateModel3dDto) {
    return 'This action adds a new model3d';
  }

  findAll() {
    return `This action returns all model3d`;
  }

  findOne(id: number) {
    return `This action returns a #${id} model3d`;
  }

  update(id: number, updateModel3dDto: UpdateModel3dDto) {
    return `This action updates a #${id} model3d`;
  }

  remove(id: number) {
    return `This action removes a #${id} model3d`;
  }
}
