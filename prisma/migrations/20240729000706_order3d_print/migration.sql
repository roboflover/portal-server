/*
  Warnings:

  - Added the required column `summa` to the `OrderPrint3d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderPrint3d" ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "summa" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "customerEmail" DROP NOT NULL;
