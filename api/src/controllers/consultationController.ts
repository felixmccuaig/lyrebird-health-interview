// src/controllers/consultationController.ts

import { Request, Response, NextFunction } from "express";
import { ConsultationService } from "../services/consultationService";

const consultationService = new ConsultationService();

export class ConsultationController {
  public static async createConsultation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required." });
      return;
    }

    try {
      const consultation = await consultationService.createConsultation(
        title,
        description
      );
      res.status(201).json({
        message: "Consultation created successfully.",
        consultation: {
          id: consultation.id,
          title: consultation.title,
          description: consultation.description,
          created_at: consultation.created_at,
          updated_at: consultation.updated_at,
          note: {
            id: consultation.note.id,
            content: consultation.note.content,
            created_at: consultation.note.created_at,
            updated_at: consultation.note.updated_at,
          },
          recordings: consultation.recordings,
        },
      });
    } catch (error: any) {
      console.error("Error creating consultation:", error);
      res.status(500).json({ error: "Failed to create consultation." });
    }
  }

  public static async uploadRecording(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const consultationId = parseInt(req.params.id, 10);

    if (isNaN(consultationId)) {
      res.status(400).json({ error: "Invalid consultation ID." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    try {
      const { recordingId, transcriptionText } =
        await consultationService.uploadRecording(consultationId, req.file);

      res.status(200).json({
        message: "File uploaded and transcribed successfully.",
        recording: {
          id: recordingId,
          filename: req.file.filename,
          filepath: `recordings/${req.file.filename}`,
          mimetype: req.file.mimetype,
          size: req.file.size,
          created_at: new Date(), // Ideally, fetch from DB
          updated_at: new Date(), // Ideally, fetch from DB
        },
        transcription: {
          text: transcriptionText,
          created_at: new Date(), // Ideally, fetch from DB
          updated_at: new Date(), // Ideally, fetch from DB
        },
      });
    } catch (error: any) {
      console.error("Error processing upload and transcription:", error);
      res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
  }

  public static async getAllConsultations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consultations = await consultationService.getAllConsultations();
      res.status(200).json({
        consultations,
      });
    } catch (error: any) {
      console.log("Caight error");
      console.error("Error retrieving consultations:", error.stack); // Log the stack trace
      next(error); // Pass the error to the next middleware
    }
  }

  public static async getConsultationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const consultationId = parseInt(req.params.id, 10);

    if (isNaN(consultationId)) {
      res.status(400).json({ error: "Invalid consultation ID." });
      return;
    }

    try {
      const consultation = await consultationService.getConsultationById(
        consultationId
      );

      if (!consultation) {
        res.status(404).json({ error: "Consultation not found." });
        return;
      }

      res.status(200).json({
        consultation,
      });
    } catch (error: any) {
      console.error("Error retrieving consultation:", error);
      res.status(500).json({ error: "Failed to retrieve consultation." });
    }
  }
}
