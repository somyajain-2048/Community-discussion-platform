import prisma from "../../config/prisma";

export const searchAllService = async (query: string) => {
  if (!query) {
    throw new Error("Search query required");
  }

  // search posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

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
  });

  // search communities
  const communities = await prisma.community.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  // search users
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },

        {
          bio: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
    },
  });

  return {
    posts,
    communities,
    users,
  };
};
