// this shows the json data returned
import { Router } from "express";

import { checkInLookup } from "./check-in.controller";

const router = Router();

router.get("/:qr_token", checkInLookup);

export default router;
