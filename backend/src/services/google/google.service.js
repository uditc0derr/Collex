import { google } from "googleapis";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { encrypt, decrypt } from "../crypto/crypto.service.js";
import { ApiError } from "../../utils/api-error.js";

const scopes = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "openid"
];

export function oauthClient() {
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);
}

export function getConnectUrl(userId) {
  return oauthClient().generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: userId
  });
}

export async function connectAccount({ code, userId }) {
  try {
    const client = oauthClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) throw new ApiError(400, "Google did not return a refresh token");
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const { data: profile } = await oauth2.userinfo.get();
    const drive = google.drive({ version: "v3", auth: client });
    const { data: about } = await drive.about.get({ fields: "storageQuota" });

    return prisma.googleAccount.upsert({
      where: { userId_googleId: { userId, googleId: profile.id } },
      update: {
        email: profile.email,
        encryptedRefreshToken: encrypt(tokens.refresh_token),
        quota: BigInt(about.storageQuota?.limit || 0),
        usedStorage: BigInt(about.storageQuota?.usage || 0),
        status: "ACTIVE"
      },
      create: {
        userId,
        email: profile.email,
        googleId: profile.id,
        encryptedRefreshToken: encrypt(tokens.refresh_token),
        quota: BigInt(about.storageQuota?.limit || 0),
        usedStorage: BigInt(about.storageQuota?.usage || 0)
      }
    });
  } catch (error) {
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "";
    if (error?.code === 403 && message.toLowerCase().includes("insufficient authentication scopes")) {
      throw new ApiError(400, "Google authorization is missing required Drive permissions. Disconnect and connect again.");
    }
    throw error;
  }
}

export async function authedDrive(accountId, userId) {
  const account = await prisma.googleAccount.findFirst({ where: { id: accountId, userId, status: "ACTIVE" } });
  if (!account) throw new ApiError(404, "Google account not found");
  const client = oauthClient();
  client.setCredentials({ refresh_token: decrypt(account.encryptedRefreshToken) });
  return { account, drive: google.drive({ version: "v3", auth: client }) };
}

export async function disconnectAccount(id, userId) {
  return prisma.googleAccount.update({ where: { id, userId }, data: { status: "DISCONNECTED" } });
}
