-- CreateEnum
CREATE TYPE "ChatSpaceKind" AS ENUM ('GENERAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ChatSpaceRole" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "spaceId" TEXT;

-- CreateTable
CREATE TABLE "chat_spaces" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kind" "ChatSpaceKind" NOT NULL DEFAULT 'CUSTOM',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_space_members" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ChatSpaceRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_space_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_spaces_orgId_idx" ON "chat_spaces"("orgId");

-- CreateIndex
CREATE INDEX "chat_space_members_userId_idx" ON "chat_space_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_space_members_spaceId_userId_key" ON "chat_space_members"("spaceId", "userId");

-- CreateIndex
CREATE INDEX "channels_spaceId_idx" ON "channels"("spaceId");

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "chat_spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_spaces" ADD CONSTRAINT "chat_spaces_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_space_members" ADD CONSTRAINT "chat_space_members_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "chat_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_space_members" ADD CONSTRAINT "chat_space_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Partial unique: exactly one GENERAL space per org
CREATE UNIQUE INDEX "chat_spaces_orgId_general_key" ON "chat_spaces"("orgId") WHERE "kind" = 'GENERAL';
