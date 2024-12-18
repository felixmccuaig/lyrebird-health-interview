// src/repositories/noteRepository.ts

import { Repository } from "typeorm";
import { Note } from "../entities/Note";
import { AppDataSource } from "../data-source";

export class NoteRepository {
  private repo: Repository<Note>;

  constructor() {
    this.repo = AppDataSource.getRepository(Note);
  }

  public async getNoteByConsultationId(
    consultationId: number
  ): Promise<Note | null> {
    return await this.repo.findOne({
      where: { consultation: { id: consultationId } },
      relations: ["consultation"],
    });
  }

  public async createNote(
    content: string,
    consultationId: number
  ): Promise<Note> {
    const note = this.repo.create({
      content,
      consultation: { id: consultationId } as any, // TypeORM needs an entity or partial
    });
    return await this.repo.save(note);
  }

  public async updateNote(noteId: number, content: string): Promise<Note> {
    await this.repo.update(noteId, { content });
    return await this.repo.findOneOrFail({
      where: { id: noteId },
      relations: ["consultation"],
    });
  }
}
