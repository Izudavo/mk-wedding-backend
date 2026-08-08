import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/AppError";

export async function findGuestByQrToken(qr_token: string) {
  const rsvp = await prisma.rSVP.findUnique({
    where: {
      qr_token,
    },

    include: {
      access_code: true,
    },
  });

  if (!rsvp) {
    throw new AppError(404, "Guest not found.");
  }

  return {
    id: rsvp.id,

    qr_token: rsvp.qr_token,

    full_name: rsvp.full_name,

    phone_number: rsvp.phone_number,

    email: rsvp.email,

    has_plus_one: rsvp.has_plus_one,

    plus_one_name: rsvp.plus_one_name,

    source: rsvp.source,

    check_in_status: rsvp.check_in_status,

    access_code: rsvp.access_code?.code ?? null,
  };
}

//check-in a guest
export async function checkInGuest(qr_token: string) {
  const rsvp = await prisma.rSVP.findUnique({
    where: {
      qr_token,
    },
  });

  if (!rsvp) {
    throw new AppError(404, "Guest not found.");
  }

  if (rsvp.check_in_status === "CHECKED_IN") {
    throw new AppError(400, "Guest has already been checked in.");
  }

  const updatedRsvp = await prisma.rSVP.update({
    where: {
      id: rsvp.id,
    },

    data: {
      check_in_status: "CHECKED_IN",
      checked_in_at: new Date(),
    },
  });

  return {
    id: updatedRsvp.id,
    full_name: updatedRsvp.full_name,
    phone_number: updatedRsvp.phone_number,
    email: updatedRsvp.email,
    has_plus_one: updatedRsvp.has_plus_one,
    plus_one_name: updatedRsvp.plus_one_name,
    source: updatedRsvp.source,
    check_in_status: updatedRsvp.check_in_status,
    checked_in_at: updatedRsvp.checked_in_at,
  };
}
