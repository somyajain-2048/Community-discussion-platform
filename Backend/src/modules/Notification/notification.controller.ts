import { Request, Response } from "express";

import {
  getNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService,
} from "./notification.service";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const result = await getNotificationsService(user.id);

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

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    const result = await markNotificationReadService(notificationId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    await markAllNotificationsReadService(user.id);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
