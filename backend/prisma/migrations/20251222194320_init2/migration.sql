/*
  Warnings:

  - Added the required column `tax_name` to the `tax_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tax_master" ADD COLUMN     "tax_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_locations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_locations_user_id_location_id_key" ON "user_locations"("user_id", "location_id");

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
