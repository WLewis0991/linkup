import express from "express";
import prisma from "../config/db";
import { authMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";

const router = express.Router();
type ParamsWithId = { id: string };

router.get("/", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: req.user?.userId,
      },
    },
  });

  res.json(users);
});

router.get("/:id", authMiddleware, async (req: Request<ParamsWithId>, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        bios: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("User fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req: Request<ParamsWithId>, res) => {
  const { id } = req.params;
  const { avatar, bios } = req.body; // ✅ added bios

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(avatar !== undefined && { avatar }),
        ...(bios !== undefined && { bios }),
      },
    });
    return res.json(updated);
  } catch (err) {
    console.error("User update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;