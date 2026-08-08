import { Router } from "express";

import { list, details } from "./admin-guest.controller";

import { adminAuth } from "../../../common/middleware/admin-auth";

const router = Router();

router.get("/", adminAuth, list);

router.get("/:id", adminAuth, details);

export default router;
