// src/controllers/noteController.ts

import { Request, Response, NextFunction } from "express";
import { NoteService } from "../services/noteService";

const noteService = new NoteService();

export class NoteController {
  /**
   * Retrieves the note for a specific consultation.
   * GET /notes/:consultationId
   */
  public static async getNote(req: Request, res: Response, next: NextFunction) {
    const consultationId = parseInt(req.params.consultationId, 10);

    if (isNaN(consultationId)) {
      res.status(400).json({ error: "Invalid consultation ID." });
      return;
    }

    try {
      const note = await noteService.getNote(consultationId);
      if (!note) {
        res
          .status(404)
          .json({ error: "Note not found for this consultation." });
        return;
      }

      res.status(200).json({ note });
    } catch (error: any) {
      console.error("Error fetching note:", error);
      res.status(500).json({ error: "Failed to fetch note." });
    }
  }

  /**
   * Creates or updates the note for a specific consultation.
   * POST /notes/:consultationId
   */
  public static async createOrUpdateNote(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const consultationId = parseInt(req.params.consultationId, 10);
    const { content } = req.body;

    if (isNaN(consultationId)) {
      res.status(400).json({ error: "Invalid consultation ID." });
      return;
    }

    if (typeof content !== "string" || content.trim() === "") {
      res
        .status(400)
        .json({ error: "Content is required and must be a non-empty string." });
      return;
    }

    try {
      const note = await noteService.createOrUpdateNote(
        consultationId,
        content.trim()
      );
      res.status(200).json({ message: "Note saved successfully.", note });
    } catch (error: any) {
      console.error("Error saving note:", error);
      res.status(500).json({ error: "Failed to save note." });
    }
  }
}
