-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'manager', 'staff');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('checkin', 'checkout');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ROL', 'EOQ');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('pending', 'sent', 'acknowledged');

-- CreateTable
CREATE TABLE "users" (
    "userId" UUID NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "password" TEXT NOT NULL,
    "role" "UserType" NOT NULL DEFAULT 'staff',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailNotification" BOOLEAN NOT NULL DEFAULT false,
    "locationIds" UUID[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "locations" (
    "locationId" UUID NOT NULL,
    "locationCode" VARCHAR(50) NOT NULL,
    "locationName" VARCHAR(150) NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "supplier_master" (
    "supplierId" UUID NOT NULL,
    "supplierName" VARCHAR(150) NOT NULL,
    "contactPerson" VARCHAR(100),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" TEXT,
    "gstNumber" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("supplierId")
);

-- CreateTable
CREATE TABLE "type_master" (
    "typeId" UUID NOT NULL,
    "typeName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_master_pkey" PRIMARY KEY ("typeId")
);

-- CreateTable
CREATE TABLE "tax_master" (
    "taxId" UUID NOT NULL,
    "taxPercentage" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_master_pkey" PRIMARY KEY ("taxId")
);

-- CreateTable
CREATE TABLE "item_master" (
    "itemId" UUID NOT NULL,
    "itemCode" VARCHAR(50) NOT NULL,
    "itemName" VARCHAR(150) NOT NULL,
    "locationId" UUID NOT NULL,
    "openingQty" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currentQty" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "barcode" TEXT,
    "supplierId" UUID,
    "typeId" UUID,
    "taxId" UUID,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "taxPercent" DECIMAL(5,2),
    "totalAmount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_master_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "transaction_log" (
    "transactionId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "remainingQty" DECIMAL(10,2) NOT NULL,
    "takenBy" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "purchase_master" (
    "purchaseId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "availableQty" DECIMAL(10,2),
    "rol" DECIMAL(10,2) NOT NULL,
    "moq" DECIMAL(10,2),
    "eoq" DECIMAL(10,2),
    "lastPurchaseDate" TIMESTAMP(3),
    "supplierId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_master_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateTable
CREATE TABLE "reorder_alerts" (
    "alertId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'pending',
    "alertDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reorder_alerts_pkey" PRIMARY KEY ("alertId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "locations_locationCode_key" ON "locations"("locationCode");

-- CreateIndex
CREATE UNIQUE INDEX "type_master_typeName_key" ON "type_master"("typeName");

-- CreateIndex
CREATE UNIQUE INDEX "item_master_itemCode_locationId_key" ON "item_master"("itemCode", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_master_itemId_key" ON "purchase_master"("itemId");

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier_master"("supplierId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "type_master"("typeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "tax_master"("taxId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item_master"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_master" ADD CONSTRAINT "purchase_master_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item_master"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_master" ADD CONSTRAINT "purchase_master_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier_master"("supplierId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_alerts" ADD CONSTRAINT "reorder_alerts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item_master"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;
