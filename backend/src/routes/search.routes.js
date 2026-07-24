import { Router } from "express";
import { run } from "../controllers/search.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, run);

export default router;
