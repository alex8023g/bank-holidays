-- DropForeignKey
ALTER TABLE "public"."PersonalRanges" DROP CONSTRAINT "PersonalRanges_user_id_fkey";

-- AlterTable
ALTER TABLE "PersonalRanges" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PersonalRanges" ADD CONSTRAINT "PersonalRanges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
