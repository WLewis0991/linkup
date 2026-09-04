import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import prisma from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { createServer } from "http";
import { initializeSocket } from "./sockets/sockets";
import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/rooms.routes";
import dmRoutes from "./routes/dms.routes";
import followRoutes from "./routes/follow.routes";

const app: Application = express();
const PORT: number = env.port;

const httpServer = createServer(app);

// Behind Render's proxy: needed so express-rate-limit reads the real client IP
// from X-Forwarded-For instead of the proxy's.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

app.use("/auth", authLimiter, authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/dms", dmRoutes);
app.use("/api/follows", followRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is healthy 🍏" });
});

// Socket.IO
initializeSocket(httpServer);

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }

  const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on ${PORT}`);
  });

  const shutdown = (signal: string) => () => {
    console.log(`\n${signal} received —  Graceful shutdown`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT", shutdown("SIGINT"));
}

start();
