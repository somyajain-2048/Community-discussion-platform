import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getPrivateMessages,
  sendPrivateMessage,
  getDMUsers,
  getCommunityMessages,
  sendCommunityMessage,
} from "./message.controller";

const router = Router();

router.get("/dm-users", authMiddleware, getDMUsers);
router.post("/private", authMiddleware, sendPrivateMessage);
router.get("/private/:userId", authMiddleware, getPrivateMessages);
router.get("/community/:communityId", authMiddleware, getCommunityMessages);
router.post("/community", authMiddleware, sendCommunityMessage);

export default router;
