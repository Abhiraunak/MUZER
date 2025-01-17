/*
  Warnings:

  - You are about to drop the column `bigImd` on the `Stream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "bigImd",
ADD COLUMN     "bigImg" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "smallImg" SET DEFAULT '',
ALTER COLUMN "title" SET DEFAULT '';
