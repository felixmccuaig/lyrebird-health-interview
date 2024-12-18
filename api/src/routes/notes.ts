// src/routes/notes.ts

import { Router } from "express";
import { NoteController } from "../controllers/noteController";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

// Get Note for a Consultation
// Endpoint: GET /notes/:consultationId
router.get("/:consultationId", NoteController.getNote);

// Create or Update Note for a Consultation
// Endpoint: POST /notes/:consultationId
router.post("/:consultationId", NoteController.createOrUpdateNote);

// Error handling middleware (should be last)
router.use(errorHandler);

export default router;
