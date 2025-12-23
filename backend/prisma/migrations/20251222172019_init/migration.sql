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
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20),
    "password" TEXT NOT NULL,
    "role" "UserType" NOT NULL DEFAULT 'staff',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_notification" BOOLEAN NOT NULL DEFAULT false,
    "location_ids" UUID[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "location_id" UUID NOT NULL,
    "location_code" VARCHAR(50) NOT NULL,
    "location_name" VARCHAR(150) NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "supplier_master" (
    "supplier_id" UUID NOT NULL,
    "supplier_name" VARCHAR(150) NOT NULL,
    "contact_person" VARCHAR(100),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" TEXT,
    "gst_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "type_master" (
    "type_id" UUID NOT NULL,
    "type_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_master_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "tax_master" (
    "tax_id" UUID NOT NULL,
    "tax_percentage" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_master_pkey" PRIMARY KEY ("tax_id")
);

-- CreateTable
CREATE TABLE "item_master" (
    "item_id" UUID NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "item_name" VARCHAR(150) NOT NULL,
    "location_id" UUID NOT NULL,
    "opening_qty" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "current_qty" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "barcode" TEXT,
    "supplier_id" UUID,
    "type_id" UUID,
    "tax_id" UUID,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "tax_percent" DECIMAL(5,2),
    "total_amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_master_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "transaction_log" (
    "transaction_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "remaining_qty" DECIMAL(10,2) NOT NULL,
    "taken_by" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_log_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "purchase_master" (
    "purchase_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "available_qty" DECIMAL(10,2),
    "rol" DECIMAL(10,2) NOT NULL,
    "moq" DECIMAL(10,2),
    "eoq" DECIMAL(10,2),
    "last_purchase_date" TIMESTAMP(3),
    "supplier_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_master_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "reorder_alerts" (
    "alert_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'pending',
    "alert_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reorder_alerts_pkey" PRIMARY KEY ("alert_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_code_key" ON "locations"("location_code");

-- CreateIndex
CREATE UNIQUE INDEX "type_master_type_name_key" ON "type_master"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "item_master_item_code_location_id_key" ON "item_master"("item_code", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_master_item_id_key" ON "purchase_master"("item_id");

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
