import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const prisma =
  hasDatabase
    ? global.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  global.prisma = prisma;
}
