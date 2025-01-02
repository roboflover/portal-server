import { PartialType } from '@nestjs/mapped-types';
import { CreateModel3dDto } from './create-model3d.dto';

export class UpdateModel3dDto extends PartialType(CreateModel3dDto) {}
