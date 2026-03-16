/*
  Warnings:

  - The `role` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `role` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "role",
DROP COLUMN "user_id",
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "employee_id" TEXT;

-- DropEnum
DROP TYPE "EmployeeRole";

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;
