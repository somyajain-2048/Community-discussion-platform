import { Request, Response } from "express";

import {
  createPostService,
  getAllPostsService,
  getSinglePostService,
  getCommunityPostsService,
  updatePostService,
  deletePostService,
  getPersonalizedFeedService,
} from "./post.service";

export const createPost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await createPostService(req.body, user.id, req.file);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const result = await getAllPostsService(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const result = await getSinglePostService(req.params.id as string, userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCommunityPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const result = await getCommunityPostsService(req.params.communityId as string, userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const postId = req.params.id as string;

    const result = await updatePostService(postId, user.id, req.body, user.role);

    res.status(200).json({
      success: true,
      message: "Post updated",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const postId = req.params.id as string;

    const result = await deletePostService(postId, user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Post deleted",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPersonalizedFeed = async(
  req:Request,
  res:Response
)=>{
  try {
    const user = (req as any).user;
    const result = await getPersonalizedFeedService(user.id);

    res.status(200).json({
      success:true,
      data:result
    });
  } catch (error:any) {
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
}