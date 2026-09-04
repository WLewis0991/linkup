import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";
import prisma from "../config/db";
import { env } from "../config/env";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.frontendUrls,
      methods: ["POST", "GET"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    if (!user) {
      console.log("❌ Unauthorized socket connection attempt");
      socket.disconnect();
      return;
    }

    console.log("🔌 User connected", user?.username);

    // Join personal room so DMs can reach this socket
    socket.join(`dm_${user.userId}`);

    // Chat room sockets
    socket.on("join_room", async (room: string) => {
      socket.join(room);
      io.to(room).emit(
        "system_message",
        `${socket.data.user?.username} has joined the room!`,
      );

      const roomRecord = await prisma.room.findUnique({
        where: { name: room },
      });
      if (!roomRecord) return;

      const history = await prisma.message.findMany({
        where: { roomId: roomRecord.id },
        include: { user: true },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      const formatted = history.map((msg) => ({
        content: msg.content,
        from: {
          id: msg.user.id,
          username: msg.user.username,
          avatar: msg.user.avatar ?? null,
        },
        timestamp: msg.createdAt.toISOString(),
      }));

      socket.emit("message_history", formatted);
    });

    socket.on("leave_room", (room: string) => {
      socket.leave(room);
      io.to(room).emit(
        "system_message",
        `${socket.data.user?.username} has left the room.`,
      );
    });

    socket.on(
      "send_message",
      async ({ text, room }: { text: string; room: string }) => {
        const user = socket.data.user;

        const roomRecord = await prisma.room.findUnique({
          where: { name: room },
        });
        if (!roomRecord) return;

        // Only allow messages from users who are members of the room
        const isMember = await prisma.roomMember.findUnique({
          where: {
            userId_roomId: {
              userId: user.userId,
              roomId: roomRecord.id,
            },
          },
        });
        if (!isMember) {
          socket.emit("room_error", { message: "You are not a member of this room" });
          return;
        }

        const saved = await prisma.message.create({
          data: {
            content: text,
            roomId: roomRecord.id,
            userId: user.userId,
          },
          include: { user: true },
        });

        const message = {
          content: saved.content,
          from: {
            id: saved.user.id,
            username: saved.user.username,
            avatar: saved.user.avatar ?? null,
          },
          timestamp: saved.createdAt.toISOString(),
        };

        io.to(room).emit("receive_message", message);
      },
    );

    // DM sockets
    socket.on("join_dm", async (recipientId: string) => {
      const senderId = socket.data.user.userId;

      const conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: senderId } } },
            { participants: { some: { userId: recipientId } } },
          ],
        },
      });

      if (!conversation) return;

      const history = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        include: { user: true },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      const formatted = history.map((msg) => ({
        content: msg.content,
        from: {
          id: msg.user.id,
          username: msg.user.username,
          avatar: msg.user.avatar ?? null,
        },
        timestamp: msg.createdAt.toISOString(),
        conversationId: conversation.id,
      }));

      socket.emit("dm_history", formatted);
    });

    socket.on(
      "send_dm",
      async ({ text, recipientId }: { text: string; recipientId: string }) => {
        const senderId = socket.data.user.userId;

        if (recipientId === senderId) {
          socket.emit("dm_error", { message: "You cannot message yourself" });
          return;
        }

        const recipient = await prisma.user.findUnique({
          where: { id: recipientId },
          select: { id: true },
        });

        if (!recipient) {
          socket.emit("dm_error", { message: "User not found" });
          return;
        }

        let conversation = await prisma.conversation.findFirst({
          where: {
            AND: [
              { participants: { some: { userId: senderId } } },
              { participants: { some: { userId: recipientId } } },
            ],
          },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              participants: {
                create: [{ userId: senderId }, { userId: recipientId }],
              },
            },
          });
        }

        const saved = await prisma.message.create({
          data: {
            content: text,
            userId: senderId,
            conversationId: conversation.id,
          },
          include: { user: true },
        });

        const message = {
          content: saved.content,
          from: {
            id: saved.user.id,
            username: saved.user.username,
            avatar: saved.user.avatar ?? null,
          },
          timestamp: saved.createdAt.toISOString(),
          conversationId: conversation.id,
        };

        io.to(`dm_${senderId}`).emit("receive_dm", message);
        io.to(`dm_${recipientId}`).emit("receive_dm", message);
      },
    );

    socket.on("leave_dm", (room: string) => {
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("❗️User disconnected", socket.data.user?.username);
    });
  });

  return io;
};
