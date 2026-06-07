-- CreateEnum
CREATE TYPE "EnvScope" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION', 'SHARED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('REPO', 'DESIGN', 'STAGING', 'PRODUCTION', 'DASHBOARD', 'DOC', 'OTHER');

-- CreateTable
CREATE TABLE "project_env_vars" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scope" "EnvScope" NOT NULL DEFAULT 'SHARED',
    "key" TEXT NOT NULL,
    "valueEnc" TEXT NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_env_vars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_resources" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL DEFAULT 'OTHER',
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_env_vars_projectId_idx" ON "project_env_vars"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_env_vars_projectId_scope_key_key" ON "project_env_vars"("projectId", "scope", "key");

-- CreateIndex
CREATE INDEX "project_resources_projectId_idx" ON "project_resources"("projectId");

-- AddForeignKey
ALTER TABLE "project_env_vars" ADD CONSTRAINT "project_env_vars_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_resources" ADD CONSTRAINT "project_resources_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
