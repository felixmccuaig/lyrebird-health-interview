// src/routes/consultationSummary.ts

import { Router } from "express";
import { ConsultationSummaryController } from "../controllers/consultationSummaryController";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

router.post(
  "/:consultationId/generate-notes",
  ConsultationSummaryController.generateNotes
);

router.use(errorHandler);

export default router;
