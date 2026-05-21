import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { toggleSavedPost, getSavedPosts } from "./saved.controller";

const router = Router();

router.post("/toggle", authMiddleware, toggleSavedPost);

router.get("/my-posts", authMiddleware, getSavedPosts);

export default router;
