import { prisma } from "../../config/prisma";

interface CreateLetterInput {
  author_name: string;
  relationship?: string;
  message: string;
}

export async function createLetter(
  data: CreateLetterInput
) {
  const letter = await prisma.letter.create({
    data: {
      author_name: data.author_name,
      relationship: data.relationship ?? null,
      message: data.message,
    },
  });

  return {
    id: letter.id,
    author_name: letter.author_name,
    relationship: letter.relationship,
    message: letter.message,
    created_at: letter.created_at,
  };
}