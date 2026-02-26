-- AlterTable
ALTER TABLE "transaction_log" ADD COLUMN     "taken_by_id" UUID;

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_taken_by_id_fkey" FOREIGN KEY ("taken_by_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
