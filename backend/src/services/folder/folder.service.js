import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";

export async function listFolders(
  ownerId,
  { parentId, flat = false, status = "ACTIVE", favorite, sortBy = "name", sortOrder = "asc" } = {}
) {
  const orderField = ["name", "createdAt", "updatedAt"].includes(sortBy) ? sortBy : "name";
  const orderDirection = sortOrder === "desc" ? "desc" : "asc";
  const where = {
    ownerId,
    status,
    ...(flat ? {} : { parentId: parentId ?? null }),
    ...(favorite === undefined ? {} : { favorite })
  };
  return prisma.folder.findMany({ where, orderBy: [{ [orderField]: orderDirection }] });
}

export async function createFolder(ownerId, data) {
  return prisma.folder.create({ data: { ownerId, name: data.name, parentId: data.parentId || null } });
}

export async function updateFolder(ownerId, id, data) {
  const folder = await prisma.folder.findFirst({ where: { id, ownerId } });
  if (!folder) throw new ApiError(404, "Folder not found");

  if (data.parentId !== undefined && data.parentId !== null) {
    if (data.parentId === id) throw new ApiError(400, "Folder cannot be moved into itself");
    const parent = await prisma.folder.findFirst({ where: { id: data.parentId, ownerId, status: "ACTIVE" } });
    if (!parent) throw new ApiError(404, "Parent folder not found");
    const descendants = await listDescendantIds(ownerId, id);
    if (descendants.has(data.parentId)) throw new ApiError(400, "Folder cannot be moved into its child");
  }

  return prisma.folder.update({
    where: { id },
    data: {
      name: data.name ?? undefined,
      parentId: data.parentId ?? undefined,
      favorite: data.favorite ?? undefined,
      status: data.status ?? undefined
    }
  });
}

export async function deleteFolder(ownerId, id) {
  const folder = await prisma.folder.findFirst({ where: { id, ownerId } });
  if (!folder) throw new ApiError(404, "Folder not found");
  await trashChildren(ownerId, id);
  await prisma.file.updateMany({ where: { ownerId, folderId: id }, data: { status: "TRASHED" } });
  return prisma.folder.update({ where: { id }, data: { status: "TRASHED" } });
}

export async function permanentlyDeleteFolder(ownerId, id) {
  const folder = await prisma.folder.findFirst({ where: { id, ownerId, status: "TRASHED" } });
  if (!folder) throw new ApiError(404, "Folder not found in trash");
  return prisma.folder.delete({ where: { id } });
}

async function listDescendantIds(ownerId, folderId, seen = new Set()) {
  const children = await prisma.folder.findMany({ where: { ownerId, parentId: folderId, status: "ACTIVE" }, select: { id: true } });
  for (const child of children) {
    if (seen.has(child.id)) continue;
    seen.add(child.id);
    await listDescendantIds(ownerId, child.id, seen);
  }
  return seen;
}

async function trashChildren(ownerId, folderId) {
  const children = await prisma.folder.findMany({ where: { ownerId, parentId: folderId, status: "ACTIVE" }, select: { id: true } });
  for (const child of children) {
    await trashChildren(ownerId, child.id);
    await prisma.file.updateMany({ where: { ownerId, folderId: child.id }, data: { status: "TRASHED" } });
    await prisma.folder.update({ where: { id: child.id }, data: { status: "TRASHED" } });
  }
}
