import { Router } from "express";

import authRoutes from "./admin/admin.routes";
import accessCodeRoutes from "./access-code/access-code.routes";
import guestRoutes from "./guest/guest.routes";
import adminRoutes from "./admin";
import letterRoutes from "./letter/letter.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/access-codes", accessCodeRoutes);

router.use("/guest", guestRoutes);

router.use("/admin", adminRoutes);

router.use("/guest/letters", letterRoutes);

export default router;
