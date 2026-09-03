import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";
import { env } from "../config/env";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as CustomJwtPayload;

    req.user = decoded;

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
