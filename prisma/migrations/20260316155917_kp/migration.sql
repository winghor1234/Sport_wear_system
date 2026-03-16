/*
  Warnings:

  - You are about to drop the `PasswordOTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp_code` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp_code` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_employee_id_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "otp_code" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "otp_code" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "PasswordOTP";

-- DropTable
DROP TABLE "RefreshToken";
