import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateProductDto implements Prisma.ProductCreateInput, Prisma.ProductUpdateInput {
  price: number;
  oldPrice?: number;
  rating?: number;
  links?: string[] | Prisma.ProductCreatelinksInput;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  images?: Prisma.ImageCreateNestedManyWithoutProductInput;
  category?: Prisma.CategoryCreateNestedOneWithoutProductsInput;
  catalogs?: Prisma.CatalogCreateNestedManyWithoutProductsInput;
  pinnedInCatalog?: Prisma.CatalogCreateNestedManyWithoutPinnedProductInput;
  
  @IsInt()
  id: number; // ID обязателен для обновления

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  imageUrl: string


}