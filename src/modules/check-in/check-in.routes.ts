// this shows the html receipt page returned
import { Router } from "express";

import { checkIn, checkInPage } from "./check-in.page.controller";

const router = Router();

router.get("/:qr_token", checkInPage);

router.patch("/:qr_token", checkIn);

export default router;
