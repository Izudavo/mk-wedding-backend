import { beforeEach, describe, expect, it, vi } from "vitest";

import { findGuestByQrToken, checkInGuest } from "./check-in.service";

import { prisma } from "../../config/prisma";

vi.mock("../../config/prisma", () => ({
  prisma: {
    rSVP: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("check-in.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findGuestByQrToken", () => {
    it("should return the guest when the QR token exists", async () => {
      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue({
        id: "rsvp-id",
        qr_token: "qr-token-123",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "PENDING",
        access_code: {
          code: "AB12-CD34",
        },
      } as never);

      const result = await findGuestByQrToken("qr-token-123");

      expect(result).toEqual({
        id: "rsvp-id",
        qr_token: "qr-token-123",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "PENDING",
        access_code: "AB12-CD34",
      });

      expect(prisma.rSVP.findUnique).toHaveBeenCalledWith({
        where: {
          qr_token: "qr-token-123",
        },
        include: {
          access_code: true,
        },
      });
    });

    it("should return null access code when the guest has no access code", async () => {
      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue({
        id: "rsvp-id",
        qr_token: "qr-token-123",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: null,
        has_plus_one: false,
        plus_one_name: null,
        source: "MANUAL",
        check_in_status: "PENDING",
        access_code: null,
      } as never);

      const result = await findGuestByQrToken("qr-token-123");

      expect(result.access_code).toBeNull();
    });

    it("should throw 404 when the guest does not exist", async () => {
      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue(null);

      await expect(
        findGuestByQrToken("invalid-qr-token")
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Guest not found.",
      });
    });
  });

  describe("checkInGuest", () => {
    it("should check in a guest successfully", async () => {
      const guest = {
        id: "rsvp-id",
        qr_token: "qr-token-123",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "PENDING",
      };

      const updatedGuest = {
        ...guest,
        check_in_status: "CHECKED_IN",
        checked_in_at: new Date(),
      };

      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue(guest as never);

      vi.mocked(prisma.rSVP.update).mockResolvedValue(updatedGuest as never);

      const result = await checkInGuest("qr-token-123");

      expect(result).toEqual({
        id: "rsvp-id",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: true,
        plus_one_name: "David Johnson",
        source: "ONLINE",
        check_in_status: "CHECKED_IN",
        checked_in_at: updatedGuest.checked_in_at,
      });

      expect(prisma.rSVP.update).toHaveBeenCalledWith({
        where: {
          id: "rsvp-id",
        },
        data: {
          check_in_status: "CHECKED_IN",
          checked_in_at: expect.any(Date),
        },
      });
    });

    it("should throw 404 when the guest does not exist", async () => {
      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue(null);

      await expect(checkInGuest("invalid-qr-token")).rejects.toMatchObject({
        statusCode: 404,
        message: "Guest not found.",
      });

      expect(prisma.rSVP.update).not.toHaveBeenCalled();
    });

    it("should prevent a guest from being checked in twice", async () => {
      vi.mocked(prisma.rSVP.findUnique).mockResolvedValue({
        id: "rsvp-id",
        qr_token: "qr-token-123",
        full_name: "Rita Johnson",
        phone_number: "08015585972",
        email: "rita@example.com",
        has_plus_one: false,
        plus_one_name: null,
        source: "ONLINE",
        check_in_status: "CHECKED_IN",
      } as never);

      await expect(checkInGuest("qr-token-123")).rejects.toMatchObject({
        statusCode: 400,
        message: "Guest has already been checked in.",
      });

      expect(prisma.rSVP.update).not.toHaveBeenCalled();
    });
  });
});
