import prisma from "../../config/prisma";

export const getNotificationsService = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },

    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },

      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

export const markAllNotificationsReadService = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const markNotificationReadService = async (notificationId: string) => {
  const notification = await prisma.notification.update({
    where: {
      id: notificationId,
    },

    data: {
      isRead: true,
    },
  });

  return notification;
};
