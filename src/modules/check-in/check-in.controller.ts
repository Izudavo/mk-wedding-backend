import { Request, Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/response";
import { AppError } from "../../common/errors/AppError";

import { findGuestByQrToken } from "./check-in.service";

interface QrTokenParams {
  qr_token: string;
}

// GET /api/check-in/:qr_token
export const checkInLookup = asyncHandler(
  async (req: Request<QrTokenParams>, res: Response) => {
    const qrToken = req.params.qr_token;

    if (!qrToken) {
      throw new AppError(400, "QR token is required.");
    }

    const data = await findGuestByQrToken(qrToken);

    sendResponse(res, 200, "Guest found successfully.", data);
  }
);
