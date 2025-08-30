/*
  Warnings:

  - The `imageSrc` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "imageSrc",
ADD COLUMN     "imageSrc" TEXT[];
