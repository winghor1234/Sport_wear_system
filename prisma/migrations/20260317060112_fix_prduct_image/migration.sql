/*
  Warnings:

  - Added the required column `public_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "public_id" TEXT NOT NULL;
