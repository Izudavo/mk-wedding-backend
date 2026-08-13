import { Router } from "express";

import { login } from "./admin-auth.controller";
import { validateRequest } from "../../common/middleware/validate-request";
import { adminLoginSchema } from "./admin.validator";
import { adminAuth } from "../../common/middleware/admin-auth";
import { list } from "./letter/admin-letter.controller";

const router = Router();

router.post(
  "/login",
  validateRequest(adminLoginSchema),
  login
);

router.get(
  "/",
  adminAuth,
  list
);

export default router;