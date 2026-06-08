-- CreateTable
CREATE TABLE "message_attachments" (
    "messageId" TEXT NOT NULL,
    "attachmentId" TEXT NOT NULL,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("messageId","attachmentId")
);

-- CreateIndex
CREATE INDEX "message_attachments_attachmentId_idx" ON "message_attachments"("attachmentId");

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

