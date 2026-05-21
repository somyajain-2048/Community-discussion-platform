import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

// ======================
// ADMIN SIGNUP
// ======================
export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { username, email, secretKey } = req.body;

    if (!username || !email || !secretKey) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and secretKey are required",
      });
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key",
      });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User already exists, upgrade their role
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
    } else {
      // Check if username is taken
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }

      // Generate a random password to satisfy the DB schema
      const dummyPassword = Math.random().toString(36).slice(-10) + "Admin!";
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);

      user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// ADMIN LOGIN
// ======================
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, secretKey } = req.body;

    if (!email || !secretKey) {
      return res.status(400).json({ success: false, message: "Email and secretKey required" });
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: "Invalid admin secret key" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// GET ANALYTICS
// ======================
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalPosts = await prisma.post.count();
    const totalCommunities = await prisma.community.count();
    const totalComments = await prisma.comment.count();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const usersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } },
    });

    const usersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalCommunities,
        totalComments,
        usersThisWeek,
        usersThisMonth,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// USERS MANAGEMENT
// ======================
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!role || !["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ success: false, message: "role must be USER or ADMIN" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, email: true, role: true },
    });

    res.status(200).json({ success: true, message: "User role updated", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// POSTS MANAGEMENT
// ======================
export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, content } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
    });

    res.status(200).json({ success: true, message: "Post updated", data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { username: true } }, community: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// COMMUNITIES MANAGEMENT
// ======================
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, category, visibility } = req.body;

    const community = await prisma.community.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(visibility !== undefined && { visibility }),
      },
    });

    res.status(200).json({ success: true, message: "Community updated", data: community });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      include: { creator: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: communities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.community.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Community deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// COMMENTS MANAGEMENT
// ======================
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: { author: { select: { username: true } }, post: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.comment.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
