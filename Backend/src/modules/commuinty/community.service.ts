import prisma from "../../config/prisma";

export const createCommunityService = async (payload: any, userId: string) => {
  const { name, description, category } = payload;

  // validation
  if (!name || !description || !category) {
    throw new Error("All fields are required");
  }

  // check existing community
  const existingCommunity = await prisma.community.findUnique({
    where: {
      name,
    },
  });

  if (existingCommunity) {
    throw new Error("Community already exists");
  }

  // create community
  const community = await prisma.community.create({
    data: {
      name,
      description,
      category,
      creatorId: userId,
    },
  });

  // creator becomes owner
  await prisma.communityMember.create({
    data: {
      userId,
      communityId: community.id,
      role: "OWNER",
    },
  });

  return community;
};

export const joinCommunityService = async (
  userId: string,
  communityId: string,
) => {
  // check community exists
  const community = await prisma.community.findUnique({
    where: {
      id: communityId,
    },
  });

  if (!community) {
    throw new Error("Community not found");
  }

  // check already joined
  const existingMember = await prisma.communityMember.findFirst({
    where: {
      userId,
      communityId,
    },
  });

  if (existingMember) {
    throw new Error("Already joined community");
  }

  // create membership
  const membership = await prisma.communityMember.create({
    data: {
      userId,
      communityId,
      role: "MEMBER",
    },
  });

  return membership;
};

export const leaveCommunityService = async (
  userId: string,
  communityId: string,
) => {
  // check membership
  const membership = await prisma.communityMember.findFirst({
    where: {
      userId,
      communityId,
    },
  });

  if (!membership) {
    throw new Error("You are not member of this community");
  }

  // owner cannot leave
  if (membership.role === "OWNER") {
    throw new Error("Owner cannot leave community");
  }

  // delete membership
  await prisma.communityMember.delete({
    where: {
      id: membership.id,
    },
  });

  return null;
};

export const getAllCommunitiesService = async () => {
  const communities = await prisma.community.findMany({
    include: {
      creator: {
        select: {
          id: true,
          username: true,
        },
      },

      members: true,

      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  return communities;
};

export const getSingleCommunityService = async (communityId: string) => {
  const community = await prisma.community.findUnique({
    where: {
      id: communityId,
    },

    include: {
      creator: {
        select: {
          id: true,
          username: true,
        },
      },

      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },

      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  if (!community) {
    throw new Error("Community not found");
  }

  return community;
};