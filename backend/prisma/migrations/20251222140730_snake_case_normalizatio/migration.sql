/*
  Warnings:

  - The primary key for the `item_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `currentQty` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `itemCode` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `openingQty` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `taxPercent` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `item_master` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `item_master` table. All the data in the column will be lost.
  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationCode` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `locations` table. All the data in the column will be lost.
  - The primary key for the `purchase_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `availableQty` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `lastPurchaseDate` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseId` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `purchase_master` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_master` table. All the data in the column will be lost.
  - The primary key for the `reorder_alerts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alertDate` on the `reorder_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `alertId` on the `reorder_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `alertType` on the `reorder_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `reorder_alerts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reorder_alerts` table. All the data in the column will be lost.
  - The primary key for the `supplier_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contactPerson` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `supplier_master` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `supplier_master` table. All the data in the column will be lost.
  - The primary key for the `tax_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tax_master` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `tax_master` table. All the data in the column will be lost.
  - You are about to drop the column `taxPercentage` on the `tax_master` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tax_master` table. All the data in the column will be lost.
  - The primary key for the `transaction_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `remainingQty` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `takenBy` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `transaction_log` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction_log` table. All the data in the column will be lost.
  - The primary key for the `type_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `type_master` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `type_master` table. All the data in the column will be lost.
  - You are about to drop the column `typeName` on the `type_master` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `type_master` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailNotification` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `locationIds` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_code,location_id]` on the table `item_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location_code]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[item_id]` on the table `purchase_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type_name]` on the table `type_master` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_code` to the `item_master` table without a default value. This is not possible if the table is not empty.
  - The required column `item_id` was added to the `item_master` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `item_name` to the `item_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `item_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_price` to the `item_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `item_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_code` to the `locations` table without a default value. This is not possible if the table is not empty.
  - The required column `location_id` was added to the `locations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `location_name` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `purchase_master` table without a default value. This is not possible if the table is not empty.
  - The required column `purchase_id` was added to the `purchase_master` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `purchase_master` table without a default value. This is not possible if the table is not empty.
  - The required column `alert_id` was added to the `reorder_alerts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `alert_type` to the `reorder_alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `reorder_alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reorder_alerts` table without a default value. This is not possible if the table is not empty.
  - The required column `supplier_id` was added to the `supplier_master` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `supplier_name` to the `supplier_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `supplier_master` table without a default value. This is not possible if the table is not empty.
  - The required column `tax_id` was added to the `tax_master` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `tax_percentage` to the `tax_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tax_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `transaction_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining_qty` to the `transaction_log` table without a default value. This is not possible if the table is not empty.
  - The required column `transaction_id` was added to the `transaction_log` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `transaction_type` to the `transaction_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `transaction_log` table without a default value. This is not possible if the table is not empty.
  - The required column `type_id` was added to the `type_master` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type_name` to the `type_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `type_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_locationId_fkey";

-- DropForeignKey
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_taxId_fkey";

-- DropForeignKey
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_typeId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_master" DROP CONSTRAINT "purchase_master_itemId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_master" DROP CONSTRAINT "purchase_master_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "reorder_alerts" DROP CONSTRAINT "reorder_alerts_itemId_fkey";

-- DropForeignKey
ALTER TABLE "transaction_log" DROP CONSTRAINT "transaction_log_itemId_fkey";

-- DropIndex
DROP INDEX "item_master_itemCode_locationId_key";

-- DropIndex
DROP INDEX "locations_locationCode_key";

-- DropIndex
DROP INDEX "purchase_master_itemId_key";

-- DropIndex
DROP INDEX "type_master_typeName_key";

-- AlterTable
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "currentQty",
DROP COLUMN "itemCode",
DROP COLUMN "itemId",
DROP COLUMN "itemName",
DROP COLUMN "locationId",
DROP COLUMN "openingQty",
DROP COLUMN "purchasePrice",
DROP COLUMN "supplierId",
DROP COLUMN "taxId",
DROP COLUMN "taxPercent",
DROP COLUMN "totalAmount",
DROP COLUMN "typeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_qty" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "item_code" VARCHAR(50) NOT NULL,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "item_name" VARCHAR(150) NOT NULL,
ADD COLUMN     "location_id" UUID NOT NULL,
ADD COLUMN     "opening_qty" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "purchase_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "supplier_id" UUID,
ADD COLUMN     "tax_id" UUID,
ADD COLUMN     "tax_percent" DECIMAL(5,2),
ADD COLUMN     "total_amount" DECIMAL(10,2),
ADD COLUMN     "type_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "item_master_pkey" PRIMARY KEY ("item_id");

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "locationCode",
DROP COLUMN "locationId",
DROP COLUMN "locationName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location_code" VARCHAR(50) NOT NULL,
ADD COLUMN     "location_id" UUID NOT NULL,
ADD COLUMN     "location_name" VARCHAR(150) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id");

-- AlterTable
ALTER TABLE "purchase_master" DROP CONSTRAINT "purchase_master_pkey",
DROP COLUMN "availableQty",
DROP COLUMN "createdAt",
DROP COLUMN "itemId",
DROP COLUMN "lastPurchaseDate",
DROP COLUMN "purchaseId",
DROP COLUMN "supplierId",
DROP COLUMN "updatedAt",
ADD COLUMN     "available_qty" DECIMAL(10,2),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "last_purchase_date" TIMESTAMP(3),
ADD COLUMN     "purchase_id" UUID NOT NULL,
ADD COLUMN     "supplier_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "purchase_master_pkey" PRIMARY KEY ("purchase_id");

-- AlterTable
ALTER TABLE "reorder_alerts" DROP CONSTRAINT "reorder_alerts_pkey",
DROP COLUMN "alertDate",
DROP COLUMN "alertId",
DROP COLUMN "alertType",
DROP COLUMN "itemId",
DROP COLUMN "updatedAt",
ADD COLUMN     "alert_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "alert_id" UUID NOT NULL,
ADD COLUMN     "alert_type" "AlertType" NOT NULL,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "reorder_alerts_pkey" PRIMARY KEY ("alert_id");

-- AlterTable
ALTER TABLE "supplier_master" DROP CONSTRAINT "supplier_master_pkey",
DROP COLUMN "contactPerson",
DROP COLUMN "createdAt",
DROP COLUMN "gstNumber",
DROP COLUMN "supplierId",
DROP COLUMN "supplierName",
DROP COLUMN "updatedAt",
ADD COLUMN     "contact_person" VARCHAR(100),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gst_number" VARCHAR(50),
ADD COLUMN     "supplier_id" UUID NOT NULL,
ADD COLUMN     "supplier_name" VARCHAR(150) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("supplier_id");

-- AlterTable
ALTER TABLE "tax_master" DROP CONSTRAINT "tax_master_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "taxId",
DROP COLUMN "taxPercentage",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tax_id" UUID NOT NULL,
ADD COLUMN     "tax_percentage" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "tax_master_pkey" PRIMARY KEY ("tax_id");

-- AlterTable
ALTER TABLE "transaction_log" DROP CONSTRAINT "transaction_log_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "itemId",
DROP COLUMN "remainingQty",
DROP COLUMN "takenBy",
DROP COLUMN "transactionId",
DROP COLUMN "transactionType",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "remaining_qty" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "taken_by" TEXT,
ADD COLUMN     "transaction_id" UUID NOT NULL,
ADD COLUMN     "transaction_type" "TransactionType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transaction_id");

-- AlterTable
ALTER TABLE "type_master" DROP CONSTRAINT "type_master_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "typeId",
DROP COLUMN "typeName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type_id" UUID NOT NULL,
ADD COLUMN     "type_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "type_master_pkey" PRIMARY KEY ("type_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "emailNotification",
DROP COLUMN "fullName",
DROP COLUMN "isActive",
DROP COLUMN "locationIds",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_notification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "full_name" VARCHAR(150) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location_ids" UUID[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_master_item_code_location_id_key" ON "item_master"("item_code", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_code_key" ON "locations"("location_code");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_master_item_id_key" ON "purchase_master"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "type_master_type_name_key" ON "type_master"("type_name");

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_master"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type_master"("type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "tax_master"("tax_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item_master"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_master" ADD CONSTRAINT "purchase_master_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item_master"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_master" ADD CONSTRAINT "purchase_master_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_master"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_alerts" ADD CONSTRAINT "reorder_alerts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item_master"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
