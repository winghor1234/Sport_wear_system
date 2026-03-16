/*
  Warnings:

  - You are about to drop the column `username` on the `Employee` table. All the data in the column will be lost.
  - Made the column `email` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Employee_username_key";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;
