import crypto from "crypto";
import { env } from "../../config/env.js";

function key() {
  const raw = env.CRYPTO_KEY;
  const buffer = raw.length === 44 ? Buffer.from(raw, "base64") : Buffer.from(raw.padEnd(32, "0").slice(0, 32));
  if (buffer.length !== 32) throw new Error("CRYPTO_KEY must resolve to 32 bytes");
  return buffer;
}

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decrypt(payload) {
  const [iv, tag, encrypted] = payload.split(":").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
