import { AppError } from "../../../common/errors/AppError";
import { prisma } from "../../../config/prisma";

export async function listLetters() {
  const letters = await prisma.letter.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return {
    total: letters.length,

    letters: letters.map((letter) => ({
      id: letter.id,
      author_name: letter.author_name,
      relationship: letter.relationship,
      message: letter.message,
      created_at: letter.created_at,
    })),
  };
}

export async function getLetterById(id: string) {
  const letter = await prisma.letter.findUnique({
    where: {
      id,
    },
  });

  if (!letter) {
    throw new AppError(404, "Letter not found.");
  }

  return {
    id: letter.id,
    author_name: letter.author_name,
    relationship: letter.relationship,
    message: letter.message,
    created_at: letter.created_at,
  };
}
