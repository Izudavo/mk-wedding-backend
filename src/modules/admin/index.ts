import { Router } from "express";

import adminGuestRoutes
  from "./guest/admin-guest.routes";


const router = Router();


router.use(
  "/guests",
  adminGuestRoutes
);


export default router;