/*
  Warnings:

  - The primary key for the `PersonalSharedRanges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PersonalSharedRanges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PersonalSharedRanges" DROP CONSTRAINT "PersonalSharedRanges_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PersonalSharedRanges_pkey" PRIMARY KEY ("personal_ranges_id", "shared_ranges_id");
