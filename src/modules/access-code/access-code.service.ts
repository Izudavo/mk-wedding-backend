import { prisma } from "../../config/prisma";

import { generateAccessCode } from "../../common/utils/access-code-helper";
import { AppError } from "../../common/errors/AppError";

export async function generateAccessCodes(quantity: number) {
  const codes = new Set<string>();

  while (codes.size < quantity) {
    codes.add(generateAccessCode());

    // Only check the database once we've generated enough candidates.
    if (codes.size < quantity) {
      continue;
    }

    const existingCodes = await prisma.accessCode.findMany({
      where: {
        code: {
          in: [...codes],
        },
      },
      select: {
        code: true,
      },
    });

    if (existingCodes.length === 0) {
      break;
    }

    // Remove any codes that already exist in the database.
    for (const existing of existingCodes) {
      codes.delete(existing.code);
    }

    // The loop continues and generates replacements until
    // codes.size === quantity again.
  }

  await prisma.accessCode.createMany({
    data: [...codes].map((code) => ({
      code,
    })),
  });

  return {
    generated: quantity,
  };
}

export async function getAccessCodes() {
  return prisma.accessCode.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getAccessCodeDetails(code: string) {
  const accessCode = await prisma.accessCode.findUnique({
    where: {
      code,
    },
    include: {
      rsvp: true,
    },
  });

  if (!accessCode) {
    throw new AppError(404, "Access code not found.");
  }

  return accessCode;
}
