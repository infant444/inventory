/*
  Warnings:

  - The `quantity_type` column on the `item_master` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "categoryType" ADD VALUE 'quantityType';

-- AlterTable
ALTER TABLE "item_master" DROP COLUMN "quantity_type",
ADD COLUMN     "quantity_type" TEXT NOT NULL DEFAULT 'gram';
