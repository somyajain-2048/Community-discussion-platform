import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { createComment, getPostComments, deleteComment } from "./comment.controller";

const router = Router();

router.post("/create", authMiddleware, createComment);

router.get("/post/:postId", getPostComments);

router.delete("/:id", authMiddleware, deleteComment);

export default router;
