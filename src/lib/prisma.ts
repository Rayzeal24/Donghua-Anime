import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function isConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("can't reach database") ||
      msg.includes("connection refused") ||
      msg.includes("connection timed out") ||
      msg.includes("connect_timeout") ||
      msg.includes("connection terminated") ||
      msg.includes("socket hang up")
    );
  }
  return false;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (isConnectionError(error) && attempt < MAX_RETRIES) {
        console.warn(
          `[DB] Connexion échouée (tentative ${attempt}/${MAX_RETRIES}), nouvelle tentative dans ${RETRY_DELAY_MS}ms...`
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}
