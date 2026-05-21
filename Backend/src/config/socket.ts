import { Server } from "socket.io";
import prisma from "./prisma";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    // Allow both polling and websocket
    transports: ["polling", "websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ======================
    // JOIN PERSONAL ROOM
    // ======================
    socket.on("join", (userId: string) => {
      socket.join(userId);
    });

    // ======================
    // JOIN COMMUNITY ROOM
    // ======================
    socket.on("join_community", async ({ userId, communityId }) => {
      console.log("join_community:", { userId, communityId });
      try {
        const membership = await prisma.communityMember.findFirst({
          where: { userId, communityId },
        });

        if (!membership) {
          console.log("join_community: no membership found for", userId, communityId);
          return;
        }

        socket.join(communityId);
        console.log("join_community: socket", socket.id, "joined room", communityId);
      } catch (error) {
        console.log("Join community error:", error);
      }
    });

    // ======================
    // PRIVATE MESSAGE
    // ======================
    socket.on("send_private_message", async (data) => {
      try {
        const { content, senderId, receiverId } = data;

        if (!content || !senderId || !receiverId) return;

        const message = await prisma.message.create({
          data: {
            content,

            sender: {
              connect: { id: senderId },
            },

            receiver: {
              connect: { id: receiverId },
            },
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

        io.to(receiverId).emit("receive_private_message", message);
      } catch (error) {
        console.log("Private message error:", error);
      }
    });

    // ======================
    // GROUP MESSAGE
    // ======================
    socket.on("send_group_message", async (data) => {
      console.log("send_group_message received:", data);
      try {
        const { content, senderId, communityId } = data;

        if (!content || !senderId || !communityId) return;

        // Verify membership and ensure sender is in the room
        // (handles the race condition where join_community hasn't finished yet)
        const membership = await prisma.communityMember.findFirst({
          where: { userId: senderId, communityId },
        });

        if (!membership) {
          console.log("send_group_message: membership check failed for", senderId, communityId);
          return;
        }

        socket.join(communityId);

        const message = await prisma.message.create({
          data: {
            content,

            sender: {
              connect: { id: senderId },
            },

            community: {
              connect: { id: communityId },
            },
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

        console.log("send_group_message: emitting to room", communityId, "message id", message.id);
        io.to(communityId).emit("receive_group_message", message);
      } catch (error) {
        console.log("Group message error:", error);
      }
    });

    // ======================
    // DISCONNECT
    // ======================
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};
