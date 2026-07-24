import { Router } from "express";
import { create, list, remove, removePermanent, update } from "../controllers/folder.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFolderSchema, updateFolderSchema } from "../validations/folder.validation.js";

const router = Router();

router.get("/", requireAuth, list);
router.post("/", requireAuth, validate(createFolderSchema), create);
router.patch("/:id", requireAuth, validate(updateFolderSchema), update);
router.delete("/:id/permanent", requireAuth, removePermanent);
router.delete("/:id", requireAuth, remove);

export default router;
