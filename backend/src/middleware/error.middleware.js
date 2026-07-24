import { ApiError } from "../utils/api-error.js";
import { env } from "../config/env.js";
import { logger } from "../services/logger/logger.service.js";

export function errorHandler(err, _req, res, _next) {
  const isDatabaseConnectionError =
    err.name === "PrismaClientInitializationError" ||
    err.message?.includes("Authentication failed against database server") ||
    err.message?.includes("Can't reach database server");
  const status = isDatabaseConnectionError ? 503 : err instanceof ApiError ? err.status : 500;
  if (status === 500) logger.error({ err }, "Unhandled API error");
  if (isDatabaseConnectionError) logger.error({ err }, "Database connection failed");
  res.status(status).json({
    message: isDatabaseConnectionError
      ? "Database unavailable. Check DATABASE_URL and run migrations."
      : status === 500
        ? "Internal server error"
        : err.message,
    ...(env.NODE_ENV === "development" && { detail: err.message })
  });
}
