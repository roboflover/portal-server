import { Controller, Post, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ParseFloatPipe, ParseBoolPipe } from '@nestjs/common';
import { ParseArrayPipe } from './pipe/ParseArrayPipe'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndCreateTodo(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price', ParseFloatPipe) price: number,
    @Body('isPinned', ParseBoolPipe) isPinned: boolean,
    @Body('links', new ParseArrayPipe({ items: String, separator: ',' })) links: string[],
  ): Promise<void> {
    try {
      if (file) {
         await this.productService.uploadFile(file, title, description, price, isPinned, links );
      } else {
        throw new HttpException('Файл не найден', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла или создании todo:', error);
      throw new HttpException('Внутренняя ошибка сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productService.updateProductById(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.productService.deleteFileById(id);
  }
}
