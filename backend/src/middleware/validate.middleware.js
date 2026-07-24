import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export function validate(schema, source = "body") {
  return (req, _res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
        next(new ApiError(400, message));
        return;
      }
      next(error);
    }
  };
}
