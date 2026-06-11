WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "orgId", name ORDER BY "createdAt" ASC) AS rn
  FROM "chat_spaces"
)
UPDATE "chat_spaces" cs
SET name = cs.name || ' (' || r.rn || ')'
FROM ranked r
WHERE cs.id = r.id AND r.rn > 1;

-- CreateIndex
CREATE UNIQUE INDEX "chat_spaces_orgId_name_key" ON "chat_spaces"("orgId", "name");
