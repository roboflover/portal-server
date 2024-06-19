import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PrismaService],
})
export class CatalogModule {}
