import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Model3dService } from './model3d.service';
import { CreateModel3dDto } from './dto/create-model3d.dto';
import { UpdateModel3dDto } from './dto/update-model3d.dto';

@Controller('model3d')
export class Model3dController {
  constructor(private readonly model3dService: Model3dService) {}

  @Post()
  create(@Body() createModel3dDto: CreateModel3dDto) {
    return this.model3dService.create(createModel3dDto);
  }

  @Get()
  findAll() {
    return this.model3dService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.model3dService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModel3dDto: UpdateModel3dDto) {
    return this.model3dService.update(+id, updateModel3dDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.model3dService.remove(+id);
  }
}
