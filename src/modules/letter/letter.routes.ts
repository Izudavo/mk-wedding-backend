import { Router } from "express";

import { validateRequest } from "../../common/middleware/validate-request";

import { submitLetter } from "./letter.controller";

import { createLetterSchema } from "./letter.validator";

const router = Router();

// POST /api/guest/letters
router.post("/", validateRequest(createLetterSchema), submitLetter);

export default router;
