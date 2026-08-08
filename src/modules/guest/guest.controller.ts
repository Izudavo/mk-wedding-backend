import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/response";

import { searchRsvp, validateAccessCode } from "./guest.service";

import { createRsvp } from "./guest.service";

export const validate = asyncHandler(async (req, res) => {
  const data = await validateAccessCode(req.body.code);

  sendResponse(res, 200, "Access code is valid.", data);
});

export const submitRsvp = asyncHandler(async (req, res) => {
  const result = await createRsvp(req.body);

  sendResponse(res, 201, "RSVP submitted successfully.", result);
});

export const search = asyncHandler(async (req, res) => {
  const data = await searchRsvp(req.body.query);

  sendResponse(res, 200, "RSVP found successfully.", data);
});
