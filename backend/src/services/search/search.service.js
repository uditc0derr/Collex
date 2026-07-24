import { prisma } from "../../config/prisma.js";

export async function search(userId, q) {
  const [files, folders] = await Promise.all([
    prisma.file.findMany({
      where: { ownerId: userId, status: "ACTIVE", name: { contains: q, mode: "insensitive" } },
      take: 30,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.folder.findMany({
      where: { ownerId: userId, status: "ACTIVE", name: { contains: q, mode: "insensitive" } },
      take: 30,
      orderBy: { updatedAt: "desc" }
    })
  ]);
  return { files, folders };
}
