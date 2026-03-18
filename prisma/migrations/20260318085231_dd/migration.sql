-- AlterTable
ALTER TABLE "PurchaseDetail" ADD COLUMN     "received_qty" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
