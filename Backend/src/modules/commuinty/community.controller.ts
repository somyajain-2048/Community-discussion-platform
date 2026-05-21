import { Request, Response } from "express";

import {
  createCommunityService,
  joinCommunityService,
  leaveCommunityService,
  getAllCommunitiesService,
  getSingleCommunityService,
} from "./community.service";

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await createCommunityService(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Community created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const communityId = req.params.communityId as string;

    const result = await joinCommunityService(user.id, communityId);

    res.status(200).json({
      success: true,
      message: "Joined community successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const communityId = req.params.communityId as string;

    const result = await leaveCommunityService(user.id, communityId);

    res.status(200).json({
      success: true,
      message: "Left community successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const result = await getAllCommunitiesService();

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

export const getSingleCommunity = async (req: Request, res: Response) => {
  try {
    const communityId = req.params.id as string;

    const result = await getSingleCommunityService(communityId);

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