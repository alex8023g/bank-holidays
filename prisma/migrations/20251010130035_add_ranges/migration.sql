-- CreateTable
CREATE TABLE "PersonalRanges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ranges_json" JSONB NOT NULL,

    CONSTRAINT "PersonalRanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedRanges" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,

    CONSTRAINT "SharedRanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalSharedRanges" (
    "id" TEXT NOT NULL,
    "personal_ranges_id" TEXT NOT NULL,
    "shared_ranges_id" TEXT NOT NULL,

    CONSTRAINT "PersonalSharedRanges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonalRanges" ADD CONSTRAINT "PersonalRanges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedRanges" ADD CONSTRAINT "SharedRanges_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSharedRanges" ADD CONSTRAINT "PersonalSharedRanges_personal_ranges_id_fkey" FOREIGN KEY ("personal_ranges_id") REFERENCES "PersonalRanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalSharedRanges" ADD CONSTRAINT "PersonalSharedRanges_shared_ranges_id_fkey" FOREIGN KEY ("shared_ranges_id") REFERENCES "SharedRanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
