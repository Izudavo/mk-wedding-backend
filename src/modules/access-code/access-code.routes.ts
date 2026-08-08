import { Router } from "express";

import { adminAuth } from "../../common/middleware/admin-auth";
import { validateRequest } from "../../common/middleware/validate-request";

import { generate, list, details } from "./access-code.controller";
import { generateAccessCodesSchema } from "./access-code.validator";

const router = Router();

router.post(
  "/generate",
  adminAuth,
  validateRequest(generateAccessCodesSchema),
  generate
);

router.get("/", adminAuth, list);

router.get("/:code", adminAuth, details);

export default router;
