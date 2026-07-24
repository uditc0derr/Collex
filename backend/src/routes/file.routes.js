import { Router } from "express";
import { destroy, download, get, list, move, trash, update } from "../controllers/file.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { fileUpdateSchema, moveFileSchema } from "../validations/file.validation.js";

const router = Router();

router.get("/", requireAuth, list);
router.get("/:id", requireAuth, get);
router.get("/:id/download", requireAuth, download);
router.patch("/:id", requireAuth, validate(fileUpdateSchema), update);
router.delete("/:id", requireAuth, trash);
router.delete("/:id/permanent", requireAuth, destroy);
router.post("/move", requireAuth, validate(moveFileSchema), move);

export default router;
