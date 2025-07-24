
// src/libs/prisma.ts
import { PrismaClient } from '.prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // optional for debugging
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma } // ✅ Make sure you're exporting it
