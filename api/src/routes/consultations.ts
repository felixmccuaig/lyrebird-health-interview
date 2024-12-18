// src/routes/consultations.ts

import { Router } from "express";
import { ConsultationController } from "../controllers/consultationController";
import upload from "../config/multer";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

// Create a new Consultation
router.post("/", ConsultationController.createConsultation);

// Upload a Recording to a Consultation
router.post(
  "/:id/upload",
  upload.single("file"),
  ConsultationController.uploadRecording
);

// Get All Consultations
router.get("/", ConsultationController.getAllConsultations);

// Get a Single Consultation
router.get("/:id", ConsultationController.getConsultationById);

// Error handling middleware (should be last)
router.use(errorHandler);

export default router;
