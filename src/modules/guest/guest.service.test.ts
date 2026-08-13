import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateAccessCode, createRsvp, searchRsvp } from "./guest.service";

import { prisma } from "../../config/prisma";

vi.mock("../../config/prisma", () => ({
  prisma: {
    accessCode: {
      findUnique: vi.fn(),
    },
    rSVP: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("../../common/utils/qr", () => ({
  generateQrCode: vi.fn(),
}));

vi.mock("../../config/env", () => ({
  env: {
    CHECK_IN_URL: "https://example.com/check-in",
  },
}));

describe("guest.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateAccessCode", () => {
    it("should return valid when the access code exists and is unused", async () => {
      vi.mocked(prisma.accessCode.findUnique).mockResolvedValue({
        id: "access-code-id",
        code: "AB12-CD34",
        status: "UNUSED",
      } as never);

      const result = await validateAccessCode("AB12-CD34");

      expect(result).toEqual({
        valid: true,
      });

      expect(prisma.accessCode.findUnique).toHaveBeenCalledWith({
        where: {
          code: "AB12-CD34",
        },
      });
    });

    it("should throw 404 when the access code does not exist", async () => {
      vi.mocked(prisma.accessCode.findUnique).mockResolvedValue(null);

      await expect(validateAccessCode("INVALID-CODE")).rejects.toMatchObject({
        statusCode: 404,
        message: "Invalid access code.",
      });
    });

    it("should throw 400 when the access code has already been used", async () => {
      vi.mocked(prisma.accessCode.findUnique).mockResolvedValue({
        id: "access-code-id",
        code: "AB12-CD34",
        status: "USED",
      } as never);

      await expect(validateAccessCode("AB12-CD34")).rejects.toMatchObject({
        statusCode: 400,
        message: "Access code has already been used.",
      });
    });
  });

  describe("createRsvp", () => {
    it("should create an RSVP, mark the access code as used, and generate a QR code", async () => {
      const accessCode = {
        id: "access-code-id",
        code: "AB12-CD34",
        status: "UNUSED",
      };

      const rsvp = {
        id: "rsvp-id",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        qr_token: "qr-token-123",
      };

      const updatedAccessCode = {
        ...accessCode,
        status: "USED",
        rsvp_id: "rsvp-id",
      };

      const tx = {
        accessCode: {
          findUnique: vi.fn().mockResolvedValue(accessCode),
          update: vi.fn().mockResolvedValue(updatedAccessCode),
        },
        rSVP: {
          create: vi.fn().mockResolvedValue(rsvp),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(tx as never)
      );

      const { generateQrCode } = await import("../../common/utils/qr");

      vi.mocked(generateQrCode).mockResolvedValue("generated-qr-code");

      const result = await createRsvp({
        code: "AB12-CD34",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
      });

      expect(result).toEqual({
        id: "rsvp-id",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        qr_token: "qr-token-123",
        qr_code: "generated-qr-code",
      });

      expect(tx.accessCode.findUnique).toHaveBeenCalledWith({
        where: {
          code: "AB12-CD34",
        },
      });

      expect(tx.rSVP.create).toHaveBeenCalledWith({
        data: {
          full_name: "Rita Johnson",
          phone_number: "08015585972",
          email: "rita@example.com",
          has_plus_one: true,
          plus_one_name: "David Johnson",
          source: "ONLINE",
        },
      });

      expect(tx.accessCode.update).toHaveBeenCalledWith({
        where: {
          id: "access-code-id",
        },
        data: {
          status: "USED",
          used_at: expect.any(Date),
          rsvp_id: "rsvp-id",
        },
      });

      expect(generateQrCode).toHaveBeenCalledWith(
        "https://example.com/check-in",
        "qr-token-123",
        "AB12-CD34"
      );
    });

    it("should throw 404 when the access code does not exist", async () => {
      const tx = {
        accessCode: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(tx as never)
      );

      await expect(
        createRsvp({
          code: "INVALID-CODE",
          full_name: "Rita Johnson",
          phone_number: "08015585972",
          has_plus_one: false,
        })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Invalid access code.",
      });
    });

    it("should throw 400 when the access code has already been used", async () => {
      const tx = {
        accessCode: {
          findUnique: vi.fn().mockResolvedValue({
            id: "access-code-id",
            code: "AB12-CD34",
            status: "USED",
          }),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(tx as never)
      );

      await expect(
        createRsvp({
          code: "AB12-CD34",
          full_name: "Rita Johnson",
          phone_number: "08015585972",
          has_plus_one: false,
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Access code already used.",
      });
    });
  });

  describe("searchRsvp", () => {
    it("should find an RSVP and generate its QR code", async () => {
      const rsvp = {
        id: "rsvp-id",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "PENDING",
        qr_token: "qr-token-123",
        access_code: {
          code: "AB12-CD34",
        },
      };

      vi.mocked(prisma.rSVP.findFirst).mockResolvedValue(rsvp as never);

      const { generateQrCode } = await import("../../common/utils/qr");

      vi.mocked(generateQrCode).mockResolvedValue("generated-qr-code");

      const result = await searchRsvp("Rita");

      expect(result).toEqual({
        id: "rsvp-id",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "PENDING",
        access_code: "AB12-CD34",
        qr_token: "qr-token-123",
        qr_code: "generated-qr-code",
      });

      expect(prisma.rSVP.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              full_name: {
                contains: "Rita",
              },
            },
            {
              phone_number: "Rita",
            },
            {
              email: "Rita",
            },
            {
              access_code: {
                code: "Rita",
              },
            },
          ],
        },
        include: {
          access_code: true,
        },
      });

      expect(generateQrCode).toHaveBeenCalledWith(
        "https://example.com/check-in",
        "qr-token-123",
        "AB12-CD34"
      );
    });

    it("should throw 404 when the RSVP does not exist", async () => {
      vi.mocked(prisma.rSVP.findFirst).mockResolvedValue(null);

      await expect(searchRsvp("Unknown Guest")).rejects.toMatchObject({
        statusCode: 404,
        message: "RSVP not found.",
      });
    });
  });
});
