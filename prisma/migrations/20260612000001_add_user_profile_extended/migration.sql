-- AlterTable: add extended profile fields (idempotent)
DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "phone" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "linkedIn" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'BRL';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
