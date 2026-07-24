import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./services/logger/logger.service.js";

app.listen(env.PORT, () => {
  logger.info(`Collex API listening on ${env.PORT}`);
});
