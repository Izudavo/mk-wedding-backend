import { Router } from "express";

import adminGuestRoutes from "./guest/admin-guest.routes";
import adminLetterRoutes from "./letter/admin-letter.routes";

const router = Router();

router.use(
  "/guests",
  adminGuestRoutes
);

router.use(
  "/letters",
  adminLetterRoutes
);


export default router;