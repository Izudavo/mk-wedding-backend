import crypto from "crypto";
import { Request, Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/response";
import { AppError } from "../../common/errors/AppError";

import { checkInGuest, findGuestByQrToken } from "./check-in.service";

import { renderCheckInPage } from "./check-in.page";


interface QrTokenParams {
  qr_token: string;
}

// GET /check-in/:qr_token -- for html page
export async function checkInPage(req: Request<QrTokenParams>, res: Response) {
  const qrToken = req.params.qr_token;

  if (!qrToken) {
    throw new AppError(400, "QR token is required.");
  }

  const guest = await findGuestByQrToken(qrToken);

  const nonce = crypto.randomBytes(16).toString("base64");

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}';`
  );

  res.status(200).type("html").send(renderCheckInPage(guest, nonce));
}

// PATCH /check-in/:qr_token -- for html page button
export const checkIn = asyncHandler(
  async (req: Request<QrTokenParams>, res: Response) => {
    const qrToken = req.params.qr_token;

    if (!qrToken) {
      throw new AppError(400, "QR token is required.");
    }

    const data = await checkInGuest(qrToken);

    sendResponse(res, 200, "Guest checked in successfully.", data);
  }
);
