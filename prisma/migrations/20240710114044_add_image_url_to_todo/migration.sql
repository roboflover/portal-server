/*
  Warnings:

  - Added the required column `modelUrl` to the `OrderPrint3d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderPrint3d" ADD COLUMN     "modelUrl" TEXT NOT NULL,
ALTER COLUMN "deliveryAddress" DROP NOT NULL,
ALTER COLUMN "customerName" DROP NOT NULL,
ALTER COLUMN "orderStatus" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Model3d" (
    "id" SERIAL NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelUrl" TEXT NOT NULL,
    "orderPrint3dId" INTEGER,

    CONSTRAINT "Model3d_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Model3d" ADD CONSTRAINT "Model3d_orderPrint3dId_fkey" FOREIGN KEY ("orderPrint3dId") REFERENCES "OrderPrint3d"("id") ON DELETE SET NULL ON UPDATE CASCADE;
