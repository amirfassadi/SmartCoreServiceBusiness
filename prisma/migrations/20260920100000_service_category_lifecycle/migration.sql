-- Preserve inactive lifecycle state before replacing the legacy boolean representation.
ALTER TABLE "Service" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "ServiceCategory" ADD COLUMN "archivedAt" TIMESTAMP(3);

UPDATE "Service" SET "archivedAt" = CURRENT_TIMESTAMP WHERE "active" = false;
UPDATE "ServiceCategory" SET "archivedAt" = CURRENT_TIMESTAMP WHERE "active" = false;

DROP INDEX "Service_active_idx";
ALTER TABLE "Service" DROP COLUMN "active";
ALTER TABLE "ServiceCategory" DROP COLUMN "active";

CREATE INDEX "Service_archivedAt_idx" ON "Service"("archivedAt");
CREATE INDEX "ServiceCategory_archivedAt_idx" ON "ServiceCategory"("archivedAt");
