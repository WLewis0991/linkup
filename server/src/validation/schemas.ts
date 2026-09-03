import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(60, "Room name must be at most 60 characters"),
  description: z.string().max(300).optional(),
});

export const updateProfileSchema = z.object({
  avatar: z.string().url("Invalid avatar URL").or(z.literal("")).optional(),
  bios: z.string().max(280).optional(),
});
