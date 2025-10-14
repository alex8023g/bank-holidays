/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `PersonalRanges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PersonalRanges_user_id_key" ON "PersonalRanges"("user_id");
