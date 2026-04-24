import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv"

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter } as any);

prisma.$connect()
  .then(() => console.log("🛜 Connected to PostgreSQL"))
  .catch((err: Error) => console.log("‼️ DB Connection error:", err.message));

export default prisma;