
import express from "express";
import type { Application,  Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./config/db";

dotenv.config();


const app:Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(cors({origin:process.env.FRONTEND_URL || "https://localhost:5173"}));
app.use(express.json());

app.get("/api/health", (_req:Request, res: Response) => {
    res.json({status:"ok", message: "Server is healthy 🍏"});
});

prisma.$connect();

app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${PORT}`)
})


