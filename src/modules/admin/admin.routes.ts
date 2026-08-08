import { Router } from "express";

import { login } from "./admin-auth.controller";
import { validateRequest } from "../../common/middleware/validate-request";
import { adminLoginSchema } from "./admin.validator";

const router = Router();

router.post(
  "/login",
  validateRequest(adminLoginSchema),
  login
);

export default router;