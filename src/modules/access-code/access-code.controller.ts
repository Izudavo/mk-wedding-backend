import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/response";
import { AppError } from "../../common/errors/AppError";

import {
  generateAccessCodes,
  getAccessCodes,
  getAccessCodeDetails,
} from "./access-code.service";

export const generate = asyncHandler(async (req, res) => {
  const data = await generateAccessCodes(req.body.quantity);

  sendResponse(res, 201, `${data.generated} access codes generated.`, data);
});

export const list = asyncHandler(async (_req, res) => {
  const data = await getAccessCodes();

  sendResponse(res, 200, "Access codes fetched successfully.", data);
});

export const details = asyncHandler(async (req, res) => {
  const code = req.params.code;

  if (!code) {
    throw new AppError(400, "Access code is required.");
  }

  const data = await getAccessCodeDetails(code);

  sendResponse(res, 200, "Access code fetched successfully.", data);
});
