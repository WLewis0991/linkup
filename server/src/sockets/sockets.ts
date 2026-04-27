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
    //When Socket Connects register user events
    io.on("connection", (socket) => {
        console.log("🔌 User connected", socket.data.user?.username);

        //Events under sockets connection
        
        registerUserEvents(io,socket);

        socket.on("disconnect", () => {
            console.log("❗️User disconnected", socket.data.user?.username);
        })
    })
    
    
    
    return io; 
}