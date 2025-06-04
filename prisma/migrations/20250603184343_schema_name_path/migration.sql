/*
  Warnings:

  - Made the column `fileName` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `filePath` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "fileName" SET NOT NULL,
ALTER COLUMN "filePath" SET NOT NULL;
