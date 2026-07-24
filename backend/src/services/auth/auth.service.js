import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
}

function signAccessToken(user) {
  return jwt.sign(publicUser(user), env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

async function signRefreshToken(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  return token;
}

export async function register({ name, email, password }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new ApiError(409, "Email already registered");
  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 12) }
  });
  return { user: publicUser(user), accessToken: signAccessToken(user), refreshToken: await signRefreshToken(user.id) };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new ApiError(401, "Invalid credentials");
  return { user: publicUser(user), accessToken: signAccessToken(user), refreshToken: await signRefreshToken(user.id) };
}

export async function logout(userId) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
