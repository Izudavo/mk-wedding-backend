import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  generateAccessCodes,
  getAccessCodes,
  getAccessCodeDetails,
} from "./access-code.service";

import { prisma } from "../../config/prisma";

vi.mock("../../config/prisma", () => ({
  prisma: {
    accessCode: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

vi.mock("../../common/utils/access-code-helper", () => ({
  generateAccessCode: vi.fn(),
}));

describe("access-code.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateAccessCodes", () => {
    it("should generate the requested number of access codes", async () => {
      const { generateAccessCode } = await import(
        "../../common/utils/access-code-helper"
      );

      vi.mocked(generateAccessCode)
        .mockReturnValueOnce("AB12-CD34")
        .mockReturnValueOnce("EF56-GH78")
        .mockReturnValueOnce("IJ90-KL12");

      vi.mocked(prisma.accessCode.findMany).mockResolvedValue([]);

      vi.mocked(prisma.accessCode.createMany).mockResolvedValue({
        count: 3,
      });

      const result = await generateAccessCodes(3);

      expect(result).toEqual({
        generated: 3,
      });

      expect(prisma.accessCode.findMany).toHaveBeenCalledOnce();

      expect(prisma.accessCode.createMany).toHaveBeenCalledOnce();

      expect(prisma.accessCode.createMany).toHaveBeenCalledWith({
        data: [
          { code: "AB12-CD34" },
          { code: "EF56-GH78" },
          { code: "IJ90-KL12" },
        ],
      });
    });
  });

  describe("getAccessCodes", () => {
    it("should return access codes ordered by newest first", async () => {
      const accessCodes = [
        {
          id: "2",
          code: "EF56-GH78",
        },
        {
          id: "1",
          code: "AB12-CD34",
        },
      ];

      vi.mocked(prisma.accessCode.findMany).mockResolvedValue(
        accessCodes as never
      );

      const result = await getAccessCodes();

      expect(result).toEqual(accessCodes);

      expect(prisma.accessCode.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: "desc",
        },
      });
    });
  });

  describe("getAccessCodeDetails", () => {
    it("should return an access code when it exists", async () => {
      const accessCode = {
        id: "1",
        code: "AB12-CD34",
        status: "UNUSED",
        rsvp: null,
      };

      vi.mocked(prisma.accessCode.findUnique).mockResolvedValue(
        accessCode as never
      );

      const result = await getAccessCodeDetails("AB12-CD34");

      expect(result).toEqual(accessCode);

      expect(prisma.accessCode.findUnique).toHaveBeenCalledWith({
        where: {
          code: "AB12-CD34",
        },
        include: {
          rsvp: true,
        },
      });
    });

    it("should throw an error when the access code does not exist", async () => {
      vi.mocked(prisma.accessCode.findUnique).mockResolvedValue(null);

      await expect(getAccessCodeDetails("INVALID-CODE")).rejects.toMatchObject({
        statusCode: 404,
        message: "Access code not found.",
      });
    });
  });
});

describe("generateAccessCodes", () => {
  it("should replace access codes that already exist in the database", async () => {
    const { generateAccessCode } = await import(
      "../../common/utils/access-code-helper"
    );

    vi.mocked(generateAccessCode)
      .mockReturnValueOnce("AB12-CD34")
      .mockReturnValueOnce("EF56-GH78")
      .mockReturnValueOnce("IJ90-KL12");

    vi.mocked(prisma.accessCode.findMany)
      .mockResolvedValueOnce([
        {
          code: "AB12-CD34",
        },
      ] as never)
      .mockResolvedValueOnce([]);

    vi.mocked(prisma.accessCode.createMany).mockResolvedValue({
      count: 2,
    });

    const result = await generateAccessCodes(2);

    expect(result).toEqual({
      generated: 2,
    });

    expect(prisma.accessCode.findMany).toHaveBeenCalledTimes(2);

    expect(prisma.accessCode.createMany).toHaveBeenCalledWith({
      data: [
        {
          code: "EF56-GH78",
        },
        {
          code: "IJ90-KL12",
        },
      ],
    });
  });
});
