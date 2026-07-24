import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { connectAccount, disconnectAccount, getConnectUrl } from "../services/google/google.service.js";

export function connect(req, res) {
  const url = getConnectUrl(req.user.id);
  if (req.query.mode === "json") return res.json({ url });
  return res.redirect(url);
}

export async function callback(req, res, next) {
  try {
    await connectAccount({ code: req.query.code, userId: req.query.state });
    res.redirect(`${env.FRONTEND_URL}/settings?google=connected`);
  } catch (error) {
    next(error);
  }
}

export async function listAccounts(req, res, next) {
  try {
    const accounts = await prisma.googleAccount.findMany({
      where: { userId: req.user.id },
      select: { id: true, email: true, quota: true, usedStorage: true, status: true, priority: true, createdAt: true }
    });
    res.json(accounts.map((account) => ({ ...account, quota: Number(account.quota), usedStorage: Number(account.usedStorage) })));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    res.json(await disconnectAccount(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}
