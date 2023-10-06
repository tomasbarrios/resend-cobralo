import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllEmailsPendingToBeSent() {
  return prisma.deliveryAttempt.findMany({
    where: {
      deliveryResult: null,
    },
  });
}
