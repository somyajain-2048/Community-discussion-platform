import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notification.controller";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllNotificationsRead);
router.patch("/:id/read", authMiddleware, markNotificationRead);

export default router;
