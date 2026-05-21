// import prisma from "../../config/prisma";

// export const createCommentService = async (payload: any, userId: string) => {
//   const { content, postId, parentId } = payload;

//   // validation
//   if (!content || !postId) {
//     throw new Error("content and postId required");
//   }

//   // check post exists
//   const post = await prisma.post.findUnique({
//     where: {
//       id: postId,
//     },
//   });

//   if (!post) {
//     throw new Error("Post not found");
//   }

//   // create comment
//   const comment = await prisma.comment.create({
//     data: {
//       content,
//       postId,
//       authorId: userId,
//       parentId,
//     },
//   });

//   return comment;
// };

// export const getPostCommentsService = async (postId: string) => {
//   const comments = await prisma.comment.findMany({
//     where: {
//       postId,
//       parentId: null,
//     },

//     include: {
//       author: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },

//       replies: {
//         include: {
//           author: {
//             select: {
//               id: true,
//               username: true,
//               avatar: true,
//             },
//           },
//         },
//       },
//     },

//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return comments;
// };
import prisma from "../../config/prisma";
import { getIO } from "../../config/socket";

export const createCommentService = async (payload: any, userId: string) => {
  const { content, postId, parentId } = payload;

  // validation
  if (!content || !postId) {
    throw new Error("content and postId required");
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

  // ======================
  // CREATE COMMENT
  // ======================
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
      parentId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  const io = getIO();

  // ======================
  // CASE 1: NORMAL COMMENT
  // ======================
  if (!parentId) {
    if (post.authorId !== userId) {
      const notification = await prisma.notification.create({
        data: {
          type: "COMMENT",
          message: "Someone commented on your post",
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

      // real-time emit
      io.to(post.authorId).emit("new_notification", notification);
    }
  }

  // ======================
  // CASE 2: REPLY
  // ======================
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: {
        id: parentId,
      },
    });

    if (parentComment && parentComment.authorId !== userId) {
      const notification = await prisma.notification.create({
        data: {
          type: "REPLY",
          message: "Someone replied to your comment",
          userId: parentComment.authorId,
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

      // real-time emit
      io.to(parentComment.authorId).emit("new_notification", notification);
    }
  }

  return comment;
};

export const getPostCommentsService = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      replies: {
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteCommentService = async (commentId: string, userId: string, userRole?: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("Unauthorized to delete this comment");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { success: true };
};