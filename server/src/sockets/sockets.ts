import dotenv from "dotenv";
import { Server as SocketIOServer ,Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";

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
        const token = socket.handshake.auth.token;

        if(!token) {
            return next(new Error("Unauthorized"))
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as unknown as CustomJwtPayload;
            socket.data.use = decoded;
            next();
        } catch (err) {
            return next(new Error("Invalid token"));
        }
    }); 
    //Socket connects
    io.on("connection", (socket) => {
        console.log("🔌 User connected", socket.data.user.username);

        //Events under sockets connection
        
        socket.on("disconnect", () => {
            console.log("❗️User disconnected", socket.data.user.username);
        })
    })
    
    
    
    return io; 
}