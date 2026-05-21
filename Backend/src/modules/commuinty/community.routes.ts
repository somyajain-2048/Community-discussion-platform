import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getAllCommunities,
  getSingleCommunity,
} from "./community.controller";

const router = Router();

router.post("/create",authMiddleware,createCommunity);
router.post("/join/:communityId",authMiddleware,joinCommunity);
router.delete("/leave/:communityId",authMiddleware,leaveCommunity);
router.get("/", getAllCommunities);
router.get("/:id", getSingleCommunity);

export default router;
