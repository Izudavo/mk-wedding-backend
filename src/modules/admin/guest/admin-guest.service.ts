import { prisma } from "../../../config/prisma";
import { AppError } from "../../../common/errors/AppError";
import { generateQrCode } from "../../../common/utils/qr";
import { env } from "../../../config/env";

export async function listGuests(query?: string) {
  const trimmedQuery = query?.trim();

  const guests = await prisma.rSVP.findMany({
    ...(trimmedQuery
      ? {
          where: {
            OR: [
              {
                full_name: {
                  contains: trimmedQuery,
                },
              },
              {
                phone_number: trimmedQuery,
              },
              {
                email: trimmedQuery,
              },
              {
                access_code: {
                  code: trimmedQuery,
                },
              },
            ],
          },
        }
      : {}),

    include: {
      access_code: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });

  return {
    total: guests.length,

    guests: guests.map((guest) => ({
      id: guest.id,

      full_name: guest.full_name,

      phone_number: guest.phone_number,

      email: guest.email,

      has_plus_one: guest.has_plus_one,

      plus_one_name: guest.plus_one_name,

      source: guest.source,

      check_in_status: guest.check_in_status,

      access_code: guest.access_code?.code ?? null,

      qr_token: guest.qr_token,

      created_at: guest.created_at,
    })),
  };
}

export async function getGuestById(id: string) {
  const guest = await prisma.rSVP.findUnique({
    where: {
      id,
    },

    include: {
      access_code: true,
    },
  });

  if (!guest) {
    throw new AppError(404, "RSVP not found.");
  }

  const qrCode = await generateQrCode(
    env.CHECK_IN_URL,
    guest.qr_token,
    guest.access_code?.code ?? ""
  );

  return {
    id: guest.id,

    full_name: guest.full_name,

    phone_number: guest.phone_number,

    email: guest.email,

    has_plus_one: guest.has_plus_one,

    plus_one_name: guest.plus_one_name,

    source: guest.source,

    check_in_status: guest.check_in_status,

    checked_in_at: guest.checked_in_at,

    access_code: guest.access_code?.code ?? null,

    qr_token: guest.qr_token,

    qr_code: qrCode,

    created_at: guest.created_at,

    updated_at: guest.updated_at,
  };
}
