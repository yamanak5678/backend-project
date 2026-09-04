import { Router } from "express";

import { downloadStatusReportController } from "../controllers/report.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.get(
    "/statuses",
    authenticateToken,
    requireAdmin,
    downloadStatusReportController
);

export default router;