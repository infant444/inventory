/*
  Warnings:

  - The values [packet,box,carton] on the enum `qtyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `opening_qty` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `packQty` on the `item_master` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "qtyType_new" AS ENUM ('gram', 'milliliter', 'kilogram', 'milligram', 'liter', 'bottle', 'can');
ALTER TABLE "item_master" ALTER COLUMN "quantity_type" DROP DEFAULT;
ALTER TABLE "transaction_log" ALTER COLUMN "quantity_type" DROP DEFAULT;
ALTER TABLE "item_master" ALTER COLUMN "quantity_type" TYPE "qtyType_new" USING ("quantity_type"::text::"qtyType_new");
ALTER TABLE "transaction_log" ALTER COLUMN "quantity_type" TYPE "qtyType_new" USING ("quantity_type"::text::"qtyType_new");
ALTER TYPE "qtyType" RENAME TO "qtyType_old";
ALTER TYPE "qtyType_new" RENAME TO "qtyType";
DROP TYPE "qtyType_old";
ALTER TABLE "item_master" ALTER COLUMN "quantity_type" SET DEFAULT 'gram';
ALTER TABLE "transaction_log" ALTER COLUMN "quantity_type" SET DEFAULT 'gram';
COMMIT;

-- AlterTable
ALTER TABLE "item_master" DROP COLUMN "opening_qty",
DROP COLUMN "packQty",
ADD COLUMN     "is_disable" BOOLEAN NOT NULL DEFAULT false;
