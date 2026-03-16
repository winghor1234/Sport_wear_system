/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `otp_code` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `otp_code` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('RESET_PASSWORD', 'VERIFY_EMAIL');

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "expiresAt",
DROP COLUMN "otp_code",
DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "expiresAt",
DROP COLUMN "otp_code",
DROP COLUMN "verified";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "token_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "customer_id" TEXT,
    "employee_id" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "otp_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp_code" TEXT NOT NULL,
    "type" "OTPType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("otp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "OTP_email_idx" ON "OTP"("email");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;
