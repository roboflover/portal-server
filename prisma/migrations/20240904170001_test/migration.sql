/*
  Warnings:

  - The `creationTime` column on the `OrderPrint3d` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OrderPrint3d" DROP COLUMN "creationTime",
ADD COLUMN     "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
