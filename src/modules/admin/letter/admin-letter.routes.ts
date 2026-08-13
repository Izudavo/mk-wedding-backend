import { Router } from "express";

import { adminAuth } from "../../../common/middleware/admin-auth";

import { details, list } from "./admin-letter.controller";

const router = Router();

router.get("/", adminAuth, list);

router.get("/:id", adminAuth, details);

export default router;
