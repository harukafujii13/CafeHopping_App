import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as any as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;
