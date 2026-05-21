// import prisma from "../../config/prisma";
// import { getIO } from "../../config/socket";

// export const toggleLikeService = async (payload: any, userId: string) => {
//   const { postId } = payload;

//   // validation
//   if (!postId) {
//     throw new Error("postId required");
//   }

//   // check post exists
//   const post = await prisma.post.findUnique({
//     where: {
//       id: postId,
//     },
//   });

// if (post?.authorId !== userId) {
//  const notification = await prisma.notification.create({
//    data: {
//      type: "LIKE",

//      message: "Someone liked your post",

//      userId: post.authorId,

//      senderId: userId,

//      postId,
//    },

//    include: {
//      sender: {
//        select: {
//          id: true,
//          username: true,
//          avatar: true,
//        },
//      },
//    },
//  });

//  const io = getIO();

//  io.to(post.authorId).emit("new_notification", notification);
// }

//   if (!post) {
//     throw new Error("Post not found");
//   }

//   // check existing like
//   const existingLike = await prisma.like.findFirst({
//     where: {
//       userId,
//       postId,
//     },
//   });

//   // unlike
//   if (existingLike) {
//     await prisma.like.delete({
//       where: {
//         id: existingLike.id,
//       },
//     });

//     return {
//       liked: false,
//       message: "Post unliked",
//     };
//   }

//   // like
//   await prisma.like.create({
//     data: {
//       userId,
//       postId,
//     },
//   });

//   return {
//     liked: true,
//     message: "Post liked",
//   };
// };

import prisma from "../../config/prisma";
import { getIO } from "../../config/socket";

export const toggleLikeService = async (payload: any, userId: string) => {
  const { postId } = payload;

  // validation
  if (!postId) {
    throw new Error("postId required");
  }

  // check post exists
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // check existing like
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });

  // ======================
  // UNLIKE
  // ======================
  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return {
      liked: false,
      message: "Post unliked",
    };
  }

  // ======================
  // LIKE
  // ======================
  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  // ======================
  // CREATE NOTIFICATION
  // ======================
  if (post.authorId !== userId) {
    const notification = await prisma.notification.create({
      data: {
        type: "LIKE",
        message: "Someone liked your post",
        userId: post.authorId,
        senderId: userId,
        postId,
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

    const io = getIO();

    io.to(post.authorId).emit("new_notification", notification);
  }

  return {
    liked: true,
    message: "Post liked",
  };
};