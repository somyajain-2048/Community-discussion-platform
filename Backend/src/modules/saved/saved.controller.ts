import { Request, Response } from "express";

import { toggleSavedPostService, getSavedPostsService } from "./saved.service";

export const toggleSavedPost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await toggleSavedPostService(req.body, user.id);

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

export const getSavedPosts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await getSavedPostsService(user.id);

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
