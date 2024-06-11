/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_exhibitionId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_projectId_fkey";

-- AlterTable
ALTER TABLE "Exhibition" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "createdAt";
