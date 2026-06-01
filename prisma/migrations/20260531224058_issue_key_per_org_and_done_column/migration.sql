-- DropIndex
DROP INDEX "issues_key_key";

-- AlterTable
ALTER TABLE "columns" ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "issues_orgId_idx" ON "issues"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "issues_orgId_key_key" ON "issues"("orgId", "key");

-- Backfill done columns
UPDATE "columns" SET "isDone" = true WHERE "name" = 'Concluído';
