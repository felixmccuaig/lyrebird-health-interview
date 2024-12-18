// src/services/noteService.ts

import { NoteRepository } from "../repositories/noteRepository";
import { Note } from "../entities/Note";

export class NoteService {
  private noteRepo: NoteRepository;

  constructor() {
    this.noteRepo = new NoteRepository();
  }

  /**
   * Retrieves the note for a given consultation.
   * @param consultationId - The ID of the consultation.
   * @returns The associated note or null if none exists.
   */
  public async getNote(consultationId: number): Promise<Note | null> {
    return await this.noteRepo.getNoteByConsultationId(consultationId);
  }

  /**
   * Creates or updates the note for a consultation.
   * @param consultationId - The ID of the consultation.
   * @param content - The markdown content of the note.
   * @returns The created or updated note.
   */
  public async createOrUpdateNote(
    consultationId: number,
    content: string
  ): Promise<Note> {
    const existingNote = await this.noteRepo.getNoteByConsultationId(
      consultationId
    );
    if (existingNote) {
      return await this.noteRepo.updateNote(existingNote.id, content);
    } else {
      return await this.noteRepo.createNote(content, consultationId);
    }
  }
}
