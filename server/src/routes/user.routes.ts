import express from "express";
import prisma from "../config/db";


const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

export default router;