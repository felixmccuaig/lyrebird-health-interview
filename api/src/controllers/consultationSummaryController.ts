// src/controllers/consultationSummaryController.ts

import { Request, Response } from "express";
import { ConsultationNote } from "../entities/ConsultationNote";
import { Consultation } from "../entities/Consultation";
import { summariseNotes } from "../services/consultationSummaryService";
import { AppDataSource } from "../data-source";

export class ConsultationSummaryController {
  public static async generateNotes(req: Request, res: Response) {
    const consultationId = parseInt(req.params.consultationId, 10);

    if (isNaN(consultationId)) {
      res.status(400).json({ error: "Invalid consultation ID." });
      return;
    }

    const consultationRepo = AppDataSource.getRepository(Consultation);
    const consultationNoteRepo = AppDataSource.getRepository(ConsultationNote);

    try {
      const consultation = await consultationRepo.findOne({
        where: { id: consultationId },
        relations: ["note", "recordings", "recordings.transcription"],
      });

      if (!consultation) {
        res.status(404).json({ error: "Consultation not found." });
        return;
      }

      const combinedContent = await summariseNotes(consultation);
      if (consultation.consultationNote) {
        consultation.consultationNote.generatedContent = combinedContent;
        const updatedNote = await consultationNoteRepo.save(
          consultation.consultationNote
        );

        res.status(200).json({ consultationNote: updatedNote });
        return;
      }

      // Create new note if one doesn't exist
      const newConsultationNote = consultationNoteRepo.create({
        consultation,
        generatedContent: combinedContent,
      });

      const savedNote = await consultationNoteRepo.save(newConsultationNote);
      res.status(201).json({ consultationNote: savedNote });
      return;
    } catch (error) {
      console.error("Error generating consultation notes:", error);
      res.status(500).json({ error: "Failed to generate consultation notes." });
      return;
    }
  }
}
