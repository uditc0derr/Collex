import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";

export async function chooseDestinationAccount(userId, policy = "largest-space") {
  const accounts = await prisma.googleAccount.findMany({ where: { userId, status: "ACTIVE" } });
  if (!accounts.length) throw new ApiError(400, "Connect a Google account before uploading");

  if (policy === "priority") return accounts.sort((a, b) => b.priority - a.priority)[0];
  if (policy === "round-robin") {
    const file = await prisma.file.findFirst({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } });
    const index = file ? (accounts.findIndex((a) => a.id === file.googleAccountId) + 1) % accounts.length : 0;
    return accounts[index];
  }
  return accounts.sort((a, b) => Number(b.quota - b.usedStorage - (a.quota - a.usedStorage)))[0];
}
