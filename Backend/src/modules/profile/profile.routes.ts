import { Router } from "express";

import { authMiddleware, optionalAuthMiddleware } from "../../middlewares/auth.middleware";

import upload from "../../middlewares/multer.middleware";

import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
} from "./profile.controller";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.get("/users/all", optionalAuthMiddleware, getAllUsers);

router.get("/:userId", optionalAuthMiddleware, getUserProfile);

router.patch("/update", authMiddleware, upload.single("avatar"), updateProfile);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
