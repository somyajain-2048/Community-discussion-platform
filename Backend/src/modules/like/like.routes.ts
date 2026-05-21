import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { toggleLike } from "./like.controller";

const router = Router();

router.post("/toggle", authMiddleware, toggleLike);

export default router;
