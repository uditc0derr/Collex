import { prisma } from "../../config/prisma.js";

export async function getQuota(userId) {
  const accounts = await prisma.googleAccount.findMany({ where: { userId, status: "ACTIVE" } });
  const total = accounts.reduce((sum, account) => sum + account.quota, 0n);
  const used = accounts.reduce((sum, account) => sum + account.usedStorage, 0n);
  return { total: Number(total), used: Number(used), free: Number(total - used), accounts };
}
