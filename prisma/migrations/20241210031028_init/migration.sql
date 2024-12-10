/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `isPinned` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "categoryId",
DROP COLUMN "isPinned",
DROP COLUMN "links";
