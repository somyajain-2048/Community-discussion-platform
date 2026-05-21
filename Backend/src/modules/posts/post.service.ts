// import prisma from "../../config/prisma";

// import cloudinary from "../../config/cloudinary";

// export const createPostService = async (
//   payload: any,
//   userId: string,
//   file: any,
// ) => {
//   const { title, content, communityId } = payload;

//   // validation
//   if (!title || !communityId) {
//     throw new Error("Title and communityId required");
//   }

//   // check community exists
//   const community = await prisma.community.findUnique({
//     where: {
//       id: communityId,
//     },
//   });

//   if (!community) {
//     throw new Error("Community not found");
//   }

//   let imageUrl = null;

//   // upload image
//   if (file) {
//     const base64 = Buffer.from(file.buffer).toString("base64");

//     const dataURI = `data:${file.mimetype};base64,${base64}`;

//     const uploadedImage = await cloudinary.uploader.upload(dataURI, {
//       folder: "community-posts",
//     });

//     imageUrl = uploadedImage.secure_url;
//   }

//   // create post
//   const post = await prisma.post.create({
//     data: {
//       title,
//       content,
//       image: imageUrl,
//       authorId: userId,
//       communityId,
//     },
//   });

//   return post;
// };

// export const getAllPostsService = async () => {
//   const posts = await prisma.post.findMany({
//     include: {
//       author: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },

//       community: {
//         select: {
//           id: true,
//           name: true,
//           category: true,
//         },
//       },
//     },

//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return posts;
// };

// export const getSinglePostService = async (postId: string) => {
//   const post = await prisma.post.findUnique({
//     where: {
//       id: postId,
//     },

//     include: {
//       author: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },

//       community: {
//         select: {
//           id: true,
//           name: true,
//           category: true,
//         },
//       },
//     },
//   });

//   if (!post) {
//     throw new Error("Post not found");
//   }

//   return post;
// };

// export const getCommunityPostsService = async (communityId: string) => {
//   const posts = await prisma.post.findMany({
//     where: {
//       communityId,
//     },

//     include: {
//       author: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },

//       community: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },

//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return posts;
// };

// export const updatePostService = async (
//   postId: string,
//   userId: string,
//   payload: any,
// ) => {
//   const { title, content } = payload;

//   // find post
//   const post = await prisma.post.findUnique({
//     where: {
//       id: postId,
//     },
//   });

//   if (!post) {
//     throw new Error("Post not found");
//   }

//   // ownership check
//   if (post.authorId !== userId) {
//     throw new Error("Unauthorized");
//   }

//   // update
//   const updatedPost = await prisma.post.update({
//     where: {
//       id: postId,
//     },

//     data: {
//       title,
//       content,
//     },
//   });

//   return updatedPost;
// };

// export const deletePostService = async (postId: string, userId: string) => {
//   const post = await prisma.post.findUnique({
//     where: {
//       id: postId,
//     },
//   });

//   if (!post) {
//     throw new Error("Post not found");
//   }

//   // ownership validation
//   if (post.authorId !== userId) {
//     throw new Error("Unauthorized");
//   }

//   await prisma.post.delete({
//     where: {
//       id: postId,
//     },
//   });

//   return null;
// };

// export const getPersonalizedFeedService = async(userId:string)=>{
//   const following = await prisma.follow.findMany({
//     where: {
//       followerId: userId,
//     },

//     select:{
//       followingId:true
//     },

//   });

//   const followingIds =
//   following.map((item)=>item.followingId);

//   const membership = await prisma.communityMember.findMany({
//     where:{
//       userId,
//     },

//     select:{
//       communityId:true
//     }
//   });

//   const communityIds = membership.map((item)=>item.communityId);

//   const posts = await prisma.post.findMany({
//     where: {
//       OR: [
//         {
//           authorId: {
//             in: followingIds,
//           },
//         },

//         {
//           communityId: {
//             in: communityIds,
//           },
//         },
//       ],
//     },

//     include: {
//       author: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//       community: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },

//       comments: true,

//       likes: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//     return posts;
// }

import prisma from "../../config/prisma";
import cloudinary from "../../config/cloudinary";

// ======================
// CREATE POST
// ======================
export const createPostService = async (
  payload: any,
  userId: string,
  file: any,
) => {
  const { title, content, communityId } = payload;

  if (!title) {
    throw new Error("Title is required");
  }

  if (communityId) {
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new Error("Community not found");
  }

  let imageUrl: string | null = payload.image || null;

  // upload image
  if (file) {
    const base64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const uploadedImage = await cloudinary.uploader.upload(dataURI, {
      folder: "community-posts",
    });

    imageUrl = uploadedImage.secure_url;
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      image: imageUrl,
      authorId: userId,
      ...(communityId ? { communityId } : {}),
    },
  });

  return getSinglePostService(post.id, userId);
};

// ======================
// COMMON INCLUDE (REUSABLE)
// ======================
const postInclude = {
  author: {
    select: { id: true, username: true, avatar: true },
  },
  community: {
    select: { id: true, name: true, category: true },
  },
  likes: {
    select: { userId: true },
  },
  savedBy: {
    select: { userId: true },
  },
  _count: {
    select: { likes: true, comments: true },
  },
};

// ======================
// FORMAT POSTS (LIKE/SAVE META)
// ======================
const formatPosts = (posts: any[], userId?: string) => {
  return posts.map((post) => ({
    ...post,
    isLiked: userId ? post.likes.some((l: any) => l.userId === userId) : false,
    isSaved: userId ? post.savedBy.some((s: any) => s.userId === userId) : false,
  }));
};

// ======================
// GET ALL POSTS
// ======================
export const getAllPostsService = async (userId?: string) => {
  const posts = await prisma.post.findMany({
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return formatPosts(posts, userId);
};

// ======================
// GET SINGLE POST
// ======================
export const getSinglePostService = async (postId: string, userId?: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: postInclude,
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return formatPosts([post], userId)[0];
};

// ======================
// GET COMMUNITY POSTS
// ======================
export const getCommunityPostsService = async (
  communityId: string,
  userId?: string,
) => {
  const posts = await prisma.post.findMany({
    where: { communityId },
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return formatPosts(posts, userId);
};

// ======================
// UPDATE POST
// ======================
export const updatePostService = async (
  postId: string,
  userId: string,
  payload: any,
  userRole?: string,
) => {
  const { title, content } = payload;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
    },
  });
};

// ======================
// DELETE POST
// ======================
export const deletePostService = async (postId: string, userId: string, userRole?: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: "Post deleted" };
};

// ======================
// PERSONALIZED FEED
// ======================
export const getPersonalizedFeedService = async (userId: string) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  const memberships = await prisma.communityMember.findMany({
    where: { userId },
    select: { communityId: true },
  });

  const communityIds = memberships.map((m) => m.communityId);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: { in: followingIds } },
        { communityId: { in: communityIds } },
        { communityId: null },
      ],
    },
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return formatPosts(posts, userId);
};