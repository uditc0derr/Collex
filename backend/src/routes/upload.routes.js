import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleStreamingUpload } from "../services/upload/upload.service.js";

const router = Router();

router.post("/", requireAuth, handleStreamingUpload);

export default router;
