import { Request, Response } from "express";

import { toggleLikeService } from "./like.service";

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await toggleLikeService(req.body, user.id);

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
