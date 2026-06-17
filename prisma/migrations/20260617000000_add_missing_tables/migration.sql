-- ============================================================
-- Idempotent migration: adds every table/column that exists in
-- the Prisma schema but is missing from the production database.
-- ============================================================

-- Enums (idempotent)
DO $$ BEGIN CREATE TYPE "SprintClosureType" AS ENUM ('COMPLETE', 'INCOMPLETE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PersonalSprintStatus" AS ENUM ('PLANNING', 'ACTIVE', 'CLOSED', 'INCOMPLETE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE "PersonalTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- sprints: add missing columns
DO $$ BEGIN ALTER TABLE "sprints" ADD COLUMN "closedAs" "SprintClosureType";
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "sprints" ADD COLUMN "parentSprintId" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "sprints" ADD CONSTRAINT "sprints_parentSprintId_fkey"
    FOREIGN KEY ("parentSprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- notification_preferences
CREATE TABLE IF NOT EXISTS "notification_preferences" (
    "userId"       TEXT    NOT NULL,
    "leadAssigned" BOOLEAN NOT NULL DEFAULT true,
    "dealUpdate"   BOOLEAN NOT NULL DEFAULT true,
    "taskDue"      BOOLEAN NOT NULL DEFAULT true,
    "chatMessage"  BOOLEAN NOT NULL DEFAULT false,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("userId")
);
DO $$ BEGIN
  ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- document_shares
CREATE TABLE IF NOT EXISTS "document_shares" (
    "id"               TEXT        NOT NULL,
    "documentId"       TEXT        NOT NULL,
    "sharedWithUserId" TEXT        NOT NULL,
    "grantedById"      TEXT        NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_shares_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "document_shares_documentId_sharedWithUserId_key"
  ON "document_shares"("documentId", "sharedWithUserId");
CREATE INDEX IF NOT EXISTS "document_shares_sharedWithUserId_idx" ON "document_shares"("sharedWithUserId");
DO $$ BEGIN
  ALTER TABLE "document_shares" ADD CONSTRAINT "document_shares_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "document_shares" ADD CONSTRAINT "document_shares_sharedWithUserId_fkey"
    FOREIGN KEY ("sharedWithUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "document_shares" ADD CONSTRAINT "document_shares_grantedById_fkey"
    FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- personal_sprints
CREATE TABLE IF NOT EXISTS "personal_sprints" (
    "id"             TEXT                  NOT NULL,
    "orgId"          TEXT                  NOT NULL,
    "userId"         TEXT                  NOT NULL,
    "name"           TEXT                  NOT NULL,
    "status"         "PersonalSprintStatus" NOT NULL DEFAULT 'PLANNING',
    "startDate"      TIMESTAMP(3),
    "endDate"        TIMESTAMP(3),
    "targetPoints"   INTEGER,
    "parentSprintId" TEXT,
    "createdAt"      TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_sprints_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "personal_sprints_orgId_userId_idx" ON "personal_sprints"("orgId", "userId");
DO $$ BEGIN
  ALTER TABLE "personal_sprints" ADD CONSTRAINT "personal_sprints_orgId_fkey"
    FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "personal_sprints" ADD CONSTRAINT "personal_sprints_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "personal_sprints" ADD CONSTRAINT "personal_sprints_parentSprintId_fkey"
    FOREIGN KEY ("parentSprintId") REFERENCES "personal_sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- personal_sprint_snapshots
CREATE TABLE IF NOT EXISTS "personal_sprint_snapshots" (
    "id"             TEXT         NOT NULL,
    "sprintId"       TEXT         NOT NULL,
    "capturedOn"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalTasks"     INTEGER      NOT NULL,
    "completedTasks" INTEGER      NOT NULL,
    "remainingTasks" INTEGER      NOT NULL,

    CONSTRAINT "personal_sprint_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "personal_sprint_snapshots_sprintId_capturedOn_idx"
  ON "personal_sprint_snapshots"("sprintId", "capturedOn");
DO $$ BEGIN
  ALTER TABLE "personal_sprint_snapshots" ADD CONSTRAINT "personal_sprint_snapshots_sprintId_fkey"
    FOREIGN KEY ("sprintId") REFERENCES "personal_sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- personal_tasks
CREATE TABLE IF NOT EXISTS "personal_tasks" (
    "id"            TEXT                NOT NULL,
    "orgId"         TEXT                NOT NULL,
    "userId"        TEXT                NOT NULL,
    "sprintId"      TEXT,
    "title"         TEXT                NOT NULL,
    "status"        "PersonalTaskStatus" NOT NULL DEFAULT 'TODO',
    "priority"      "Priority"          NOT NULL DEFAULT 'MED',
    "dueDate"       TIMESTAMP(3),
    "columnKey"     TEXT                NOT NULL DEFAULT 'TODO',
    "position"      INTEGER             NOT NULL DEFAULT 0,
    "isSprintMapped" BOOLEAN            NOT NULL DEFAULT false,
    "createdAt"     TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_tasks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "personal_tasks_orgId_userId_idx" ON "personal_tasks"("orgId", "userId");
DO $$ BEGIN
  ALTER TABLE "personal_tasks" ADD CONSTRAINT "personal_tasks_orgId_fkey"
    FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "personal_tasks" ADD CONSTRAINT "personal_tasks_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "personal_tasks" ADD CONSTRAINT "personal_tasks_sprintId_fkey"
    FOREIGN KEY ("sprintId") REFERENCES "personal_sprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- time_entries
CREATE TABLE IF NOT EXISTS "time_entries" (
    "id"        TEXT         NOT NULL,
    "orgId"     TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "issueId"   TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3),
    "duration"  INTEGER,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "time_entries_userId_startedAt_idx" ON "time_entries"("userId", "startedAt");
DO $$ BEGIN
  ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_orgId_fkey"
    FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_issueId_fkey"
    FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
