import { asyncHandler } from "../../../common/utils/async-handler";
import { sendResponse } from "../../../common/utils/response";
import { AppError } from "../../../common/errors/AppError";

import { getLetterById, listLetters } from "./admin-letter.service";

export const list = asyncHandler(async (_req, res) => {
  const data = await listLetters();

  sendResponse(res, 200, "Letters fetched successfully.", data);
});

export const details = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError(400, "Letter ID is required.");
  }

  const data = await getLetterById(id);

  sendResponse(res, 200, "Letter fetched successfully.", data);
});
