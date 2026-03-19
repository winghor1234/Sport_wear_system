-- CreateTable
CREATE TABLE "Refund" (
    "refund_id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("refund_id")
);

-- CreateTable
CREATE TABLE "RefundDetail" (
    "refund_detail_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "refund_id" TEXT NOT NULL,

    CONSTRAINT "RefundDetail_pkey" PRIMARY KEY ("refund_detail_id")
);

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "Sale"("sale_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundDetail" ADD CONSTRAINT "RefundDetail_refund_id_fkey" FOREIGN KEY ("refund_id") REFERENCES "Refund"("refund_id") ON DELETE CASCADE ON UPDATE CASCADE;
