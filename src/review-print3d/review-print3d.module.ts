import { Module } from '@nestjs/common';
import { ReviewPrint3dService } from './review-print3d.service';
import { ReviewPrint3dController } from './review-print3d.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReviewPrint3dController],
  providers: [ReviewPrint3dService, PrismaService],
})
export class ReviewPrint3dModule {}
