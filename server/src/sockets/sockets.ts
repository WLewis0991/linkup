import dotenv from "dotenv";
import { Server as SocketIOServer ,Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";
import { registerHooks } from "module";
import { registerUserEvents } from "./userEvents";
import prisma from "../config/db";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const initializeSocket = (httpServer: HttpServer) => {
    const io = new SocketIOServer (httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["POST", "GET"]
        }
    });

    //Authenticatoin
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            socket.data.user = decoded; // attach user safely
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
            return
        }
        console.log("🔌 User connected", user?.username);

        registerUserEvents(io, socket);

        socket.on("join_room", async (room: string) => {
        socket.join(room);
        io.to(room).emit("system_message", `${socket.data.user?.username} has joined the room.`);

        const roomRecord = await prisma.room.findUnique({ where: { name: room } });
        if (!roomRecord) return;

        const history = await prisma.message.findMany({
            where: { roomId: roomRecord.id },
            include: { user: true },          // ← this was missing
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

        socket.on("leave_room", (room) => {
            socket.leave(room);
            io.to(room).emit("system_message", `${socket.data.user?.username} has left the room.`);
        });

        socket.on("send_message", async ({ text, room }: { text: string; room: string }) => {
        const user = socket.data.user;

        const roomRecord = await prisma.room.findUnique({ where: { name: room } });
        if (!roomRecord) return;

        const saved = await prisma.message.create({
            data: {
            content: text,
            roomId: roomRecord.id,
            userId: user.userId,  // ← socket.data.user.userId
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
        });
            socket.on("disconnect", () => {
                console.log("❗️User disconnected", socket.data.user?.username);
            });
    });
    
    
    
    return io; 
}