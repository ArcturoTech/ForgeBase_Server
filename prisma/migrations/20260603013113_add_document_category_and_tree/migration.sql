-- CreateEnum
CREATE TYPE "DocCategory" AS ENUM ('OVERVIEW', 'ARCHITECTURE', 'RUNBOOK', 'ADR', 'GUIDE', 'MEETING', 'GENERAL');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "category" "DocCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "documents_projectId_idx" ON "documents"("projectId");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
