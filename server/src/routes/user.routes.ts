import express from "express";
import prisma from "../config/db";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { updateProfileSchema } from "../validation/schemas";
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
    select: {
      id: true,
      username: true,
      avatar: true,
      bios: true,
      createdAt: true,
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

router.patch("/:id", authMiddleware, validate(updateProfileSchema), async (req: Request<ParamsWithId>, res) => {
  const { id } = req.params;
  const { avatar, bios } = req.body;

  // Only allow a user to update their own profile
  if (id !== req.user?.userId) {
    return res.status(403).json({ error: "You can only edit your own profile" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(avatar !== undefined && { avatar }),
        ...(bios !== undefined && { bios }),
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        bios: true,
        createdAt: true,
      },
    });
    return res.json(updated);
  } catch (err) {
    console.error("User update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;