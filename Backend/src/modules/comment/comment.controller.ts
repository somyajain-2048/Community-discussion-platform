import { Request, Response } from "express";

import {
  createCommentService,
  getPostCommentsService,
  deleteCommentService,
} from "./comment.service";

export const createComment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await createCommentService(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;

    const result = await getPostCommentsService(postId);

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

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const commentId = req.params.id as string;

    const result = await deleteCommentService(commentId, user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Comment deleted",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
