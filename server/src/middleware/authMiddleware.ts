import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;

    req.user = decoded; // ✅ single source of truth

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}