import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Missing token");

  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET);
    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
}
