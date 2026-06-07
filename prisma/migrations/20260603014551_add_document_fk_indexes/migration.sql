-- CreateIndex
CREATE INDEX "document_comments_authorId_idx" ON "document_comments"("authorId");

-- CreateIndex
CREATE INDEX "documents_parentId_idx" ON "documents"("parentId");

-- CreateIndex
CREATE INDEX "documents_authorId_idx" ON "documents"("authorId");
