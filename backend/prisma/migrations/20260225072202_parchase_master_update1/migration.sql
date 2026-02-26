-- CreateEnum
CREATE TYPE "qtyType" AS ENUM ('gram', 'milliliter', 'kilogram', 'milligram', 'liter', 'packet', 'box', 'carton', 'bottle', 'can');

-- AlterTable
ALTER TABLE "purchase_master" ADD COLUMN     "default_decrease" DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN     "default_increase" DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN     "quantity_type" "qtyType" NOT NULL DEFAULT 'gram';
