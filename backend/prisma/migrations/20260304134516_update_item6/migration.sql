/*
  Warnings:

  - You are about to alter the column `pack_count` on the `item_master` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "item_master" ALTER COLUMN "pack_count" SET DATA TYPE DECIMAL(10,2);
