import { prisma } from "../../config/prisma.js";
import { getQuota } from "../quota/quota.service.js";

export async function dashboard(userId) {
  const [storage, recentFiles, activity, counts] = await Promise.all([
    getQuota(userId),
    prisma.file.findMany({
      where: { ownerId: userId, status: "ACTIVE" },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { googleAccount: { select: { email: true } } }
    }),
    prisma.activityLog.findMany({ where: { userId }, take: 12, orderBy: { createdAt: "desc" } }),
    prisma.file.groupBy({ by: ["status"], where: { ownerId: userId }, _count: true })
  ]);
  return { storage, recentFiles, activity, statistics: { files: counts } };
}
