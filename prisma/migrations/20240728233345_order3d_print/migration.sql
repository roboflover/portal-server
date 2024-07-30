/*
  Warnings:

  - You are about to drop the column `orderName` on the `OrderPrint3d` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `OrderPrint3d` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderPrint3d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderPrint3d" DROP COLUMN "orderName",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
