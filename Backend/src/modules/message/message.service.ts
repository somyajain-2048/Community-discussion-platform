import prisma from "../../config/prisma";

export const getPrivateMessagesService = async (
  currentUserId: string,
  otherUserId: string,
) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    },
    include: {
      sender: { select: { id: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const sendPrivateMessageService = async (
  senderId: string,
  receiverId: string,
  content: string,
) => {
  const message = await prisma.message.create({
    data: {
      content,
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
    },
    include: {
      sender: { select: { id: true, username: true, avatar: true } },
    },
  });
  return message;
};

export const getDMUsersService = async (userId: string) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, avatar: true, bio: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return following.map((f) => f.following);
};

export const sendCommunityMessageService = async (
  senderId: string,
  communityId: string,
  content: string,
) => {
  const membership = await prisma.communityMember.findFirst({
    where: { userId: senderId, communityId },
  });

  if (!membership) {
    throw new Error("You are not a member of this community");
  }

  const message = await prisma.message.create({
    data: {
      content,
      sender: { connect: { id: senderId } },
      community: { connect: { id: communityId } },
    },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true },
      },
    },
  });

  return message;
};

export const getCommunityMessagesService = async (communityId: string) => {
  return prisma.message.findMany({
    where: { communityId },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};
