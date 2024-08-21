/*
  Warnings:

  - Made the column `customerName` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerEmail` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileName` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerPhone` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `summa` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileSize` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volume` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `OrderPrint3d` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderPrint3d" ALTER COLUMN "customerName" SET NOT NULL,
ALTER COLUMN "customerEmail" SET NOT NULL,
ALTER COLUMN "fileName" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "customerPhone" SET NOT NULL,
ALTER COLUMN "summa" SET NOT NULL,
ALTER COLUMN "fileSize" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "material" SET NOT NULL,
ALTER COLUMN "volume" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;
