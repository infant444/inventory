-- CreateTable
CREATE TABLE "item_price_master" (
    "id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_price_master_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_price_master" ADD CONSTRAINT "item_price_master_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item_master"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
