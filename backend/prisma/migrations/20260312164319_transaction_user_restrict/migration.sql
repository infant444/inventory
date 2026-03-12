-- DropForeignKey
ALTER TABLE "transaction_log" DROP CONSTRAINT "transaction_log_taken_by_id_fkey";

-- AddForeignKey
ALTER TABLE "transaction_log" ADD CONSTRAINT "transaction_log_taken_by_id_fkey" FOREIGN KEY ("taken_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
