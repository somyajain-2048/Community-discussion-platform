import { Router } from "express";
import { registerUser, loginUser, getMe, refreshAccessToken } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", authMiddleware, getMe);
export default router;
