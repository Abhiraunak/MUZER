/*
  Warnings:

  - Added the required column `addedById` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CurrentStream" DROP CONSTRAINT "CurrentStream_streamId_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_streamId_fkey";

-- AlterTable
ALTER TABLE "CurrentStream" ALTER COLUMN "streamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "addedById" TEXT NOT NULL,
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "played" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playedTs" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentStream" ADD CONSTRAINT "CurrentStream_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
