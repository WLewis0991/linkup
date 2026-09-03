import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

const adapter = new PrismaPg({ connectionString: env.databaseUrl });

const prisma = new PrismaClient({ adapter });

export default prisma;
