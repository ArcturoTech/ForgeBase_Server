-- Idempotent: adds columns that exist in the Prisma schema but were
-- missing from the production database.

-- organizations: description, website, cnpj, sector, city, state
DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "description" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "website" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "cnpj" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "sector" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "city" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "organizations" ADD COLUMN "state" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- issues: standalone
DO $$ BEGIN ALTER TABLE "issues" ADD COLUMN "standalone" BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- documents: isPrivate, isFolder
DO $$ BEGIN ALTER TABLE "documents" ADD COLUMN "isPrivate" BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "documents" ADD COLUMN "isFolder" BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
