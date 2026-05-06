/*
  Warnings:

  - You are about to drop the column `region` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "region",
ADD COLUMN     "schoolNetwork" TEXT NOT NULL DEFAULT 'PUBLICA',
ALTER COLUMN "grade" SET DEFAULT 12;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "grade" SET DEFAULT 12;
