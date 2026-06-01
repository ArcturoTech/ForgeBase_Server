-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('EPIC', 'STORY', 'TASK', 'BUG');

-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "type" "IssueType" NOT NULL DEFAULT 'TASK';
