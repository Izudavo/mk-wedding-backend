import { loginAdmin } from "./admin.service";
import { sendResponse } from "../../common/utils/response";
import { asyncHandler } from "../../common/utils/async-handler";

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const data = await loginAdmin(username, password);

  sendResponse(res, 200, "Login successful.", data);
});