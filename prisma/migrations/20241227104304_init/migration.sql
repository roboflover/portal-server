/*
  Warnings:

  - Added the required column `userId` to the `Model3d` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model3d" ADD COLUMN     "imageLinkId" INTEGER,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ImageLink" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "orderPrint3dId" INTEGER,

    CONSTRAINT "ImageLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Model3d" ADD CONSTRAINT "Model3d_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model3d" ADD CONSTRAINT "Model3d_imageLinkId_fkey" FOREIGN KEY ("imageLinkId") REFERENCES "ImageLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLink" ADD CONSTRAINT "ImageLink_orderPrint3dId_fkey" FOREIGN KEY ("orderPrint3dId") REFERENCES "OrderPrint3d"("id") ON DELETE SET NULL ON UPDATE CASCADE;
