import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { toggleFollow, getFollowers, getFollowing } from "./follow.controller";

const router = Router();

router.post("/toggle/:userId", authMiddleware, toggleFollow);

router.get("/followers/:userId", getFollowers);

router.get("/following/:userId", getFollowing);

export default router;
