import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExhibitionController],
  providers: [ExhibitionService, PrismaService],
})
export class ExhibitionModule {}
