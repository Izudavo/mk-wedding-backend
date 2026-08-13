import { beforeEach, describe, expect, it, vi } from "vitest";

import { createLetter } from "./letter.service";

import { prisma } from "../../config/prisma";

vi.mock("../../config/prisma", () => ({
  prisma: {
    letter: {
      create: vi.fn(),
    },
  },
}));

describe("letter.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createLetter", () => {
    it("should create a letter successfully", async () => {
      const createdAt = new Date();

      vi.mocked(prisma.letter.create).mockResolvedValue({
        id: "letter-id",
        author_name: "Uncle David & Family",
        relationship: "Family",
        message: "Wishing you both a lifetime of happiness.",
        created_at: createdAt,
        updated_at: createdAt,
      } as never);

      const result = await createLetter({
        author_name: "Uncle David & Family",
        relationship: "Family",
        message: "Wishing you both a lifetime of happiness.",
      });

      expect(result).toEqual({
        id: "letter-id",
        author_name: "Uncle David & Family",
        relationship: "Family",
        message: "Wishing you both a lifetime of happiness.",
        created_at: createdAt,
      });

      expect(prisma.letter.create).toHaveBeenCalledWith({
        data: {
          author_name: "Uncle David & Family",
          relationship: "Family",
          message: "Wishing you both a lifetime of happiness.",
        },
      });
    });

    it("should store null when relationship is not provided", async () => {
      const createdAt = new Date();

      vi.mocked(prisma.letter.create).mockResolvedValue({
        id: "letter-id",
        author_name: "Rita",
        relationship: null,
        message: "Congratulations to you both!",
        created_at: createdAt,
        updated_at: createdAt,
      } as never);

      const result = await createLetter({
        author_name: "Rita",
        message: "Congratulations to you both!",
      });

      expect(result).toEqual({
        id: "letter-id",
        author_name: "Rita",
        relationship: null,
        message: "Congratulations to you both!",
        created_at: createdAt,
      });

      expect(prisma.letter.create).toHaveBeenCalledWith({
        data: {
          author_name: "Rita",
          relationship: null,
          message: "Congratulations to you both!",
        },
      });
    });
  });
});