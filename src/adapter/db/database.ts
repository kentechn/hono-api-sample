import 'dotenv/config'
import { PrismaClient } from "generated/prisma/client.js";

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default db;