import prisma from "../../config/prisma";

import cloudinary from "../../config/cloudinary";

export const getMyProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    include: {
      posts: true,

      communities: {
        include: {
          community: true,
        },
      },
    },
  });

  return user;
};

export const getUserProfileService = async (userId: string, viewerId?: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: {
          community: { select: { id: true, name: true } },
          _count: { select: { comments: true, likes: true } },
          likes: { select: { userId: true } },
          savedBy: { select: { userId: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      communities: {
        include: {
          community: {
            select: {
              id: true,
              name: true,
              category: true,
              _count: { select: { members: true } },
            },
          },
        },
      },
      _count: {
        select: { followers: true, following: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const posts = user.posts.map((post) => ({
    ...post,
    isLiked: viewerId ? post.likes.some((l) => l.userId === viewerId) : false,
    isSaved: viewerId ? post.savedBy.some((s) => s.userId === viewerId) : false,
  }));

  // Total likes received across all posts
  const totalLikesReceived = user.posts.reduce((sum, p) => sum + p._count.likes, 0);

  // Posts per month for last 6 months
  const now = new Date();
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("en-US", { month: "short" });
    const count = user.posts.filter((p) => {
      const pd = new Date(p.createdAt);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    }).length;
    return { month: label, count };
  });

  // Top posts by likes
  const topPosts = [...user.posts]
    .sort((a, b) => b._count.likes - a._count.likes)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      likes: p._count.likes,
      comments: p._count.comments,
      communityName: p.community?.name,
    }));

  return {
    ...user,
    posts,
    totalLikesReceived,
    monthlyStats,
    topPosts,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    joinedCommunities: user.communities.map((uc) => uc.community),
  };
};

export const getAllUsersService = async (currentUserId?: string) => {
  const users = await prisma.user.findMany({
    where: currentUserId ? { id: { not: currentUserId } } : {},
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      followers: {
        where: currentUserId ? { followerId: currentUserId } : undefined,
        select: { followerId: true },
      },
      _count: {
        select: { followers: true, following: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    bio: u.bio,
    isFollowing: u.followers.length > 0,
    followersCount: u._count.followers,
    followingCount: u._count.following,
  }));
};

export const deleteAccountService = async (userId: string) => {
  // Delete communities where user is creator first (no cascade from User→Community)
  await prisma.community.deleteMany({ where: { creatorId: userId } });
  // Delete user — remaining relations cascade via schema
  await prisma.user.delete({ where: { id: userId } });
};

export const updateProfileService = async (
  payload: any,
  userId: string,
  file: any,
) => {
  const { bio } = payload;

  let avatarUrl;

  // upload avatar
  if (file) {
    const base64 = Buffer.from(file.buffer).toString("base64");

    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const uploaded = await cloudinary.uploader.upload(dataURI, {
      folder: "avatars",
    });

    avatarUrl = uploaded.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      bio,
      ...(avatarUrl && {
        avatar: avatarUrl,
      }),
    },
  });

  return updatedUser;
};
