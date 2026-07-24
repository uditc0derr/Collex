import { prisma } from "../../config/prisma.js";
import { authedDrive } from "../google/google.service.js";
import { ApiError } from "../../utils/api-error.js";

export async function listFiles(
  userId,
  { folderId, status = "ACTIVE", favorite, sortBy = "updatedAt", sortOrder = "desc", limit } = {}
) {
  const orderField = ["updatedAt", "createdAt", "name", "size"].includes(sortBy) ? sortBy : "updatedAt";
  const orderDirection = sortOrder === "asc" ? "asc" : "desc";
  const where = {
    ownerId: userId,
    status,
    ...(folderId === undefined ? {} : { folderId }),
    ...(favorite === undefined ? {} : { favorite })
  };
  return prisma.file.findMany({
    where,
    orderBy: { [orderField]: orderDirection },
    ...(Number.isFinite(limit) ? { take: limit } : {}),
    include: { googleAccount: { select: { email: true } } }
  });
}

export async function getFile(userId, id) {
  const file = await prisma.file.findFirst({ where: { id, ownerId: userId } });
  if (!file) throw new ApiError(404, "File not found");
  return file;
}

export async function updateFile(userId, id, data) {
  const file = await getFile(userId, id);
  if (data.folderId !== undefined && data.folderId !== null) {
    const folder = await prisma.folder.findFirst({ where: { id: data.folderId, ownerId: userId } });
    if (!folder) throw new ApiError(404, "Folder not found");
  }
  const updated = await prisma.file.update({
    where: { id: file.id },
    data: {
      name: data.name ?? undefined,
      folderId: data.folderId ?? undefined,
      favorite: data.favorite ?? undefined
    }
  });
  await prisma.activityLog.create({ data: { userId, action: "UPDATE_FILE", fileId: id } });
  return updated;
}

export async function moveFile(userId, id, folderId) {
  return updateFile(userId, id, { folderId });
}

export async function trashFile(userId, id) {
  await getFile(userId, id);
  await prisma.activityLog.create({ data: { userId, action: "TRASH_FILE", fileId: id } });
  return prisma.file.update({ where: { id }, data: { status: "TRASHED" } });
}

export async function permanentlyDeleteFile(userId, id) {
  const file = await getFile(userId, id);
  const { drive } = await authedDrive(file.googleAccountId, userId);
  await drive.files.delete({ fileId: file.remoteFileId });
  await prisma.activityLog.create({ data: { userId, action: "DELETE_FILE", fileId: id } });
  return prisma.file.delete({ where: { id } });
}

export async function downloadFile(userId, id, res) {
  const file = await getFile(userId, id);
  const { drive } = await authedDrive(file.googleAccountId, userId);
  const stream = await drive.files.get({ fileId: file.remoteFileId, alt: "media" }, { responseType: "stream" });
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.name)}"`);
  stream.data.pipe(res);
}
