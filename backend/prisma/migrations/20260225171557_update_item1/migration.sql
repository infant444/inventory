/*
  Warnings:

  - You are about to drop the column `gst_number` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the `purchase_master` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rol` to the `item_master` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "purchase_master" DROP CONSTRAINT "purchase_master_item_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_master" DROP CONSTRAINT "purchase_master_supplier_id_fkey";

-- AlterTable
ALTER TABLE "item_master" ADD COLUMN     "default_decrease" DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN     "default_increase" DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN     "eoq" DECIMAL(10,2),
ADD COLUMN     "last_purchase_date" TIMESTAMP(3),
ADD COLUMN     "moq" DECIMAL(10,2),
ADD COLUMN     "quantity_type" "qtyType" NOT NULL DEFAULT 'gram',
ADD COLUMN     "rol" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "supplier_master" DROP COLUMN "gst_number";

-- DropTable
DROP TABLE "purchase_master";
