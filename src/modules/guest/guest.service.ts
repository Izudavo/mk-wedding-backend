import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/AppError";
import { generateQrCode } from "../../common/utils/qr";
import { env } from "../../config/env";

interface CreateRsvpInput {
  code: string;
  full_name: string;
  phone_number: string;
  email?: string;
  has_plus_one: boolean;
  plus_one_name?: string;
}

export async function validateAccessCode(code: string) {
  const accessCode = await prisma.accessCode.findUnique({
    where: {
      code,
    },
  });

  if (!accessCode) {
    throw new AppError(404, "Invalid access code.");
  }

  if (accessCode.status === "USED") {
    throw new AppError(400, "Access code has already been used.");
  }

  return {
    valid: true,
  };
}

// submit rsvp
export async function createRsvp(data: CreateRsvpInput) {
  const result = await prisma.$transaction(async (tx) => {
    const accessCode = await tx.accessCode.findUnique({
      where: {
        code: data.code,
      },
    });

    if (!accessCode) {
      throw new AppError(404, "Invalid access code.");
    }

    if (accessCode.status === "USED") {
      throw new AppError(400, "Access code already used.");
    }

    const rsvp = await tx.rSVP.create({
      data: {
        full_name: data.full_name,

        phone_number: data.phone_number,

        email: data.email ?? null,

        has_plus_one: data.has_plus_one,

        plus_one_name: data.plus_one_name ?? null,

        source: "ONLINE",
      },
    });

    const updatedAccessCode = await tx.accessCode.update({
      where: {
        id: accessCode.id,
      },

      data: {
        status: "USED",

        used_at: new Date(),

        rsvp_id: rsvp.id,
      },
    });

    return {
      rsvp,
      accessCode: updatedAccessCode,
    };
  });

  const qrCode = await generateQrCode(
    env.CHECK_IN_URL,
    result.rsvp.qr_token,
    result.accessCode.code
  );

  return {
    id: result.rsvp.id,

    full_name: result.rsvp.full_name,

    phone_number: result.rsvp.phone_number,

    email: result.rsvp.email,

    has_plus_one: result.rsvp.has_plus_one,

    plus_one_name: result.rsvp.plus_one_name,

    source: result.rsvp.source,

    qr_token: result.rsvp.qr_token,

    qr_code: qrCode,
  };
}

// search guest
export async function searchRsvp(query: string) {
  const rsvp = await prisma.rSVP.findFirst({
    where: {
      OR: [
        {
          full_name: {
            contains: query,
          },
        },

        {
          phone_number: query,
        },

        {
          email: query,
        },

        {
          access_code: {
            code: query,
          },
        },
      ],
    },

    include: {
      access_code: true,
    },
  });

  if (!rsvp) {
    throw new AppError(404, "RSVP not found.");
  }

  const qrCode = await generateQrCode(
    env.CHECK_IN_URL,
    rsvp.qr_token,
    rsvp.access_code!.code
  );

  return {
    id: rsvp.id,

    full_name: rsvp.full_name,

    phone_number: rsvp.phone_number,

    email: rsvp.email,

    has_plus_one: rsvp.has_plus_one,

    plus_one_name: rsvp.plus_one_name,

    source: rsvp.source,

    check_in_status: rsvp.check_in_status,

    access_code: rsvp.access_code?.code,

    qr_token: rsvp.qr_token,

    qr_code: qrCode,
  };
}
