import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/response";

import { createLetter } from "./letter.service";

export const submitLetter = asyncHandler(async (req, res) => {
  const data = await createLetter(req.body);

  sendResponse(res, 201, "Letter sealed successfully.", data);
});
