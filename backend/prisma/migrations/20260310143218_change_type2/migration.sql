/*
  Warnings:

  - A unique constraint covering the columns `[type_name,type]` on the table `type_master` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "type_master_type_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "type_master_type_name_type_key" ON "type_master"("type_name", "type");
