/*
  Warnings:

  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "name",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
