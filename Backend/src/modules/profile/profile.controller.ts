import { Request, Response } from "express";

import {
  getMyProfileService,
  getUserProfileService,
  updateProfileService,
  deleteAccountService,
  getAllUsersService,
} from "./profile.service";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await getMyProfileService(user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const viewerId = (req as any).user?.id;

    const result = await getUserProfileService(userId, viewerId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await updateProfileService(req.body, user.id, req.file);

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    await deleteAccountService(user.id);
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.id;
    const result = await getAllUsersService(currentUserId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
