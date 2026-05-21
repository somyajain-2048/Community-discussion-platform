import { Router } from "express";

import { authMiddleware, optionalAuthMiddleware } from "../../middlewares/auth.middleware";

import upload from "../../middlewares/multer.middleware";

import {
  createPost,
  getSinglePost,
  getCommunityPosts,
  getAllPosts,
  updatePost,
  deletePost,
  getPersonalizedFeed,
} from "./post.controller";

const router = Router();

router.post("/create", authMiddleware, upload.single("image"), createPost);

router.get("/", optionalAuthMiddleware, getAllPosts);
router.get("/community/:communityId", optionalAuthMiddleware, getCommunityPosts);
router.get("/feed/personalized", authMiddleware, getPersonalizedFeed);
router.get("/:id", optionalAuthMiddleware, getSinglePost);
router.patch("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);



export default router;
