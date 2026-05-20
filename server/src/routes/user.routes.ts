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

router.patch(
  "/bios",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { userId, bio } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (typeof bio === "string" && bio.length > 280) {
      return res.status(400).json({ error: "Bio must be 280 characters or fewer" });
    }

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { bios: bio?.trim() ?? null },
      });
      return res.json({ bios: updated.bios });
    } catch (err) {
      console.error("Bio update error:", err);
      return res.status(500).json({ error: "Failed to update bio" });
    }
  },
);


router.patch(
  "/:id",
  authMiddleware,
  async (req: Request<ParamsWithId>, res) => {
    const { id } = req.params;
    const { avatar } = req.body;

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { avatar },
      });
      return res.json(updated);
    } catch (err) {
      console.error("User update error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);
export default router;
