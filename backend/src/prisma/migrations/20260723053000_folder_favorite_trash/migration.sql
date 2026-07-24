-- CreateEnum
CREATE TYPE "FolderStatus" AS ENUM ('ACTIVE', 'TRASHED');

-- AlterTable
ALTER TABLE "Folder"
ADD COLUMN "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "status" "FolderStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropIndex
DROP INDEX "Folder_ownerId_parentId_idx";

-- CreateIndex
CREATE INDEX "Folder_ownerId_parentId_status_idx" ON "Folder"("ownerId", "parentId", "status");

-- CreateIndex
CREATE INDEX "Folder_ownerId_favorite_status_idx" ON "Folder"("ownerId", "favorite", "status");
