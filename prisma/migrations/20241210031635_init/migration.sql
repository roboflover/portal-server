/*
  Warnings:

  - You are about to drop the `_ProductImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductImages" DROP CONSTRAINT "_ProductImages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImages" DROP CONSTRAINT "_ProductImages_B_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "_ProductImages";
