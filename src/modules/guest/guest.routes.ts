import { Router } from "express";

import { validateRequest } from "../../common/middleware/validate-request";

import { search, submitRsvp, validate } from "./guest.controller";
import {
  createRsvpSchema,
  searchRsvpSchema,
  validateAccessCodeSchema,
} from "./guest.validator";

const router = Router();

router.post(
  "/access-code/validate",
  validateRequest(validateAccessCodeSchema),
  validate
);

router.post("/rsvp", validateRequest(createRsvpSchema), submitRsvp);

router.post("/search", validateRequest(searchRsvpSchema), search);

export default router;
