-- CreateEnum
CREATE TYPE "categoryType" AS ENUM ('item', 'financial', 'group');

-- CreateEnum
CREATE TYPE "invoiceType" AS ENUM ('general', 'purchase');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "invoice_type" "invoiceType" NOT NULL DEFAULT 'purchase';

-- AlterTable
ALTER TABLE "item_master" ADD COLUMN     "group_name" UUID,
ADD COLUMN     "packQty" DECIMAL(10,2),
ADD COLUMN     "pack_count" INTEGER;

-- AlterTable
ALTER TABLE "type_master" ADD COLUMN     "type" "categoryType" NOT NULL DEFAULT 'item';

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_group_name_fkey" FOREIGN KEY ("group_name") REFERENCES "type_master"("type_id") ON DELETE SET NULL ON UPDATE CASCADE;
