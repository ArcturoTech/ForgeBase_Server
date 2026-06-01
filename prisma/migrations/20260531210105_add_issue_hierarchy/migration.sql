-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "issues_parentId_idx" ON "issues"("parentId");

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
