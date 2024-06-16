/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exhibition" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "imageUrl";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
