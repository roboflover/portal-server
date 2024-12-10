/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "paymentId";

-- CreateTable
CREATE TABLE "OrderTicket" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "count" INTEGER,
    "paymentId" TEXT,
    "isDelete" BOOLEAN,

    CONSTRAINT "OrderTicket_pkey" PRIMARY KEY ("id")
);
