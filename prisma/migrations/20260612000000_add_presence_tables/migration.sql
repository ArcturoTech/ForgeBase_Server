-- CreateEnum (idempotent — may already exist from a manual apply)
DO $$ BEGIN
  CREATE TYPE "PresenceStatus" AS ENUM ('ONLINE', 'BUSY', 'LUNCH', 'HIBERNATING', 'OFFLINE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "user_statuses" (
    "userId" TEXT NOT NULL,
    "status" "PresenceStatus" NOT NULL DEFAULT 'OFFLINE',
    "emoji" TEXT,
    "customText" TEXT,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isManual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_statuses_pkey" PRIMARY KEY ("userId")
);

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "ping_records" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ping_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "ping_records_fromUserId_toUserId_sentAt_idx" ON "ping_records"("fromUserId", "toUserId", "sentAt");

-- AddForeignKey (idempotent)
DO $$ BEGIN
  ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ping_records" ADD CONSTRAINT "ping_records_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ping_records" ADD CONSTRAINT "ping_records_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
