// import prisma from "../../config/prisma";

// export const toggleFollowService = async (
//   currentUserId: string,
//   targetUserId: string,
// ) => {
//   if (currentUserId === targetUserId) {
//     throw new Error("You cannot follow yourself");
//   }

//   const existingFollow = await prisma.follow.findFirst({
//     where: {
//       followerId: currentUserId,
//       followingId: targetUserId,
//     },
//   });

//   // unfollow
//   if (existingFollow) {
//     await prisma.follow.delete({
//       where: {
//         id: existingFollow.id,
//       },
//     });

//     return {
//       following: false,
//       message: "User unfollowed",
//     };
//   }

//   // follow
//   await prisma.follow.create({
//     data: {
//       followerId: currentUserId,
//       followingId: targetUserId,
//     },
//   });

//   return {
//     following: true,
//     message: "User followed",
//   };
// };

// export const getFollowersService = async (userId: string) => {
//   const followers = await prisma.follow.findMany({
//     where: {
//       followingId: userId,
//     },

//     include: {
//       follower: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });

//   return followers;
// };

// export const getFollowingService = async (userId: string) => {
//   const following = await prisma.follow.findMany({
//     where: {
//       followerId: userId,
//     },

//     include: {
//       following: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });

//   return following;
// };

import prisma from "../../config/prisma";
import { getIO } from "../../config/socket";

// ======================
// TOGGLE FOLLOW
// ======================
export const toggleFollowService = async (
  currentUserId: string,
  targetUserId: string,
) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  // check target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  // ======================
  // UNFOLLOW
  // ======================
  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    return {
      following: false,
      message: "User unfollowed",
    };
  }

  // ======================
  // FOLLOW
  // ======================
  await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  // ======================
  // CREATE NOTIFICATION
  // ======================
  if (currentUserId !== targetUserId) {
    const notification = await prisma.notification.create({
      data: {
        type: "FOLLOW",
        message: "Someone started following you",
        userId: targetUserId,
        senderId: currentUserId,
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // real-time emit
    const io = getIO();

    io.to(targetUserId).emit("new_notification", notification);
  }

  return {
    following: true,
    message: "User followed",
  };
};

// ======================
// GET FOLLOWERS
// ======================
export const getFollowersService = async (userId: string) => {
  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },

    include: {
      follower: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return {
    count: followers.length,
    followers: followers.map((f) => f.follower),
  };
};

// ======================
// GET FOLLOWING
// ======================
export const getFollowingService = async (userId: string) => {
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },

    include: {
      following: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return {
    count: following.length,
    following: following.map((f) => f.following),
  };
};