import { Router } from "express";
import { callback, connect, listAccounts, remove } from "../controllers/google.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, listAccounts);
router.get("/connect", requireAuth, connect);
router.get("/callback", callback);
router.delete("/:id", requireAuth, remove);

export default router;
