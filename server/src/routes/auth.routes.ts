import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "../types/auth.types";
import prisma from "../config/db";
import { env } from "../config/env";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/schemas";

const router = express.Router();

//Register new users
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request<{}, {}, User>, res: Response) => {
    const { username, password, email } = req.body;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
        },
      });

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        env.jwtSecret,
        { expiresIn: "7d" },
      );

      return res.status(201).json({ token });
    } catch (err) {
      if (err instanceof Error) {
        console.error("[auth/register]", err.message);
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

//Login user
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request<{}, {}, User>, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        env.jwtSecret,
        { expiresIn: "7d" },
      );

      return res.json({ token });
    } catch (err) {
      if (err instanceof Error) {
        console.error("[auth/login]", err.message);
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);
export default router;
