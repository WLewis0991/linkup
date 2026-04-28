import dotenv from "dotenv";
import { Server as SocketIOServer ,Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";
import { registerHooks } from "module";
import { registerUserEvents } from "./userEvents";

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
        const message = {
        content: `${user.username} has joined the chat`,
        from: {
            id: "system",
            username: "System",
        },
        timestamp: new Date().toISOString(),
    };

    io.emit("receive_message", message);


        console.log("🔌 User connected", user?.username);

        registerUserEvents(io, socket);

        socket.on("send_message", (text: string) => {
            const user = socket.data.user;

            const message = {
            content: text,
            from: {
                id: user.id,
                username: user.username,
            },
            timestamp: new Date().toISOString(),
            };
            
            io.emit("receive_message", message);
        });
            socket.on("disconnect", () => {
                console.log("❗️User disconnected", socket.data.user?.username);
            });
    });
    
    
    
    return io; 
}