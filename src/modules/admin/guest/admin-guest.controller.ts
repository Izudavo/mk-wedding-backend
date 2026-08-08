import { asyncHandler } from "../../../common/utils/async-handler";
import { sendResponse } from "../../../common/utils/response";
import { AppError } from "../../../common/errors/AppError";

import { listGuests, getGuestById } from "./admin-guest.service";

export const list = asyncHandler(async (req, res) => {
  const query =
    typeof req.query.query === "string" ? req.query.query : undefined;

  const data = await listGuests(query);

  sendResponse(res, 200, "Guests fetched successfully.", data);
});

export const details = asyncHandler(async (req, res) => {
  const guestId = req.params.id;

  if (!guestId) {
    throw new AppError(400, "Guest ID is required.");
  }

  const data = await getGuestById(guestId);

  sendResponse(res, 200, "Guest fetched successfully.", data);
});
