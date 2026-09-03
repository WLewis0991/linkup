import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: required("JWT_SECRET"),
  databaseUrl: required("DATABASE_URL"),
  directUrl: process.env.DIRECT_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
