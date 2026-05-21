import { Request, Response } from "express";

import {
  toggleFollowService,
  getFollowersService,
  getFollowingService,
} from "./follow.service";

export const toggleFollow = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;

    const targetUserId = req.params.userId as string;

    const result = await toggleFollowService(currentUser.id, targetUserId);

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

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const result = await getFollowersService(userId);

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

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const result = await getFollowingService(userId);

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
