-- CreateTable
CREATE TABLE "sprint_snapshots" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "capturedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remainingPoints" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,

    CONSTRAINT "sprint_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sprint_snapshots_sprintId_capturedOn_idx" ON "sprint_snapshots"("sprintId", "capturedOn");

-- AddForeignKey
ALTER TABLE "sprint_snapshots" ADD CONSTRAINT "sprint_snapshots_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
