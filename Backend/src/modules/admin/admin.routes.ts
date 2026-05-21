import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import {
  adminSignup,
  adminLogin,
  getAnalytics,
  updateUser,
  getAllUsers,
  deleteUser,
  updatePost,
  getAllPosts,
  deletePost,
  updateCommunity,
  getAllCommunities,
  deleteCommunity,
  getAllComments,
  deleteComment,
} from "./admin.controller";

const router = Router();

// Auth routes (unprotected)
router.post("/auth/signup", adminSignup);
router.post("/auth/login", adminLogin);

// Admin protected routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/analytics", getAnalytics);

router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/posts", getAllPosts);
router.patch("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

router.get("/communities", getAllCommunities);
router.patch("/communities/:id", updateCommunity);
router.delete("/communities/:id", deleteCommunity);

router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteComment);

export default router;
