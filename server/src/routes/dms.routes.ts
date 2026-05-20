import express, { Request, Response } from "express";
import prisma from "../config/db";
import { authMiddleware } from "../middleware/authMiddleware";
import { CustomJwtPayload } from "../types/auth.types";

const router = express.Router();

router.get("/my-dms", authMiddleware, async (req, res) => {
  try {
    const currentUserId = (req.user as CustomJwtPayload).userId;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: currentUserId } }
      },
      include: {
        participants: {
          where: { userId: { not: currentUserId } },
          include: { user: true }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

export default router;