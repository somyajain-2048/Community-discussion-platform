import prisma from "../../config/prisma";

export const toggleSavedPostService = async (payload: any, userId: string) => {
  const { postId } = payload;

  // validation
  if (!postId) {
    throw new Error("postId required");
  }

  // check existing save
  const existingSave = await prisma.savedPost.findFirst({
    where: {
      userId,
      postId,
    },
  });

  // unsave
  if (existingSave) {
    await prisma.savedPost.delete({
      where: {
        id: existingSave.id,
      },
    });

    return {
      saved: false,
      message: "Post unsaved",
    };
  }

  // save
  await prisma.savedPost.create({
    data: {
      userId,
      postId,
    },
  });

  return {
    saved: true,
    message: "Post saved",
  };
};

export const getSavedPostsService = async (userId: string) => {
  const savedPosts = await prisma.savedPost.findMany({
    where: {
      userId,
    },

    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },

          community: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return savedPosts;
};
