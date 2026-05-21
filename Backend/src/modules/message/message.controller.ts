import { Request, Response } from "express";
import {
  getPrivateMessagesService,
  sendPrivateMessageService,
  getDMUsersService,
  getCommunityMessagesService,
  sendCommunityMessageService,
} from "./message.service";
import { getIO } from "../../config/socket";

export const getPrivateMessages = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const currentUser = (req as any).user;
    const otherUserId = req.params.userId;
    const messages = await getPrivateMessagesService(currentUser.id, otherUserId);
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendPrivateMessage = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ success: false, message: "receiverId and content are required" });
    }

    const message = await sendPrivateMessageService(user.id, receiverId, content.trim());

    try {
      const io = getIO();
      io.to(receiverId).emit("receive_private_message", message);
    } catch {}

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDMUsers = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const users = await getDMUsersService(user.id);
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCommunityMessages = async (
  req: Request<{ communityId: string }>,
  res: Response,
) => {
  try {
    const communityId = req.params.communityId;
    const messages = await getCommunityMessagesService(communityId);
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendCommunityMessage = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { communityId, content } = req.body;

    console.log("[sendCommunityMessage] userId:", user?.id, "communityId:", communityId, "content:", content?.slice(0, 30));

    if (!communityId || !content?.trim()) {
      return res.status(400).json({ success: false, message: "communityId and content are required" });
    }

    const message = await sendCommunityMessageService(user.id, communityId, content.trim());

    try {
      const io = getIO();
      io.to(communityId).emit("receive_group_message", message);
    } catch {}

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
