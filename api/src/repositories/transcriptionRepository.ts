// src/repositories/transcriptionRepository.ts

import { Repository } from "typeorm";
import { Transcription } from "../entities/Transcription";
import { Recording } from "../entities/Recording";
import { AppDataSource } from "../data-source";

export class TranscriptionRepository {
  private repo: Repository<Transcription>;

  constructor() {
    this.repo = AppDataSource.getRepository(Transcription);
  }

  public async createTranscription(
    recording: Recording,
    text: string
  ): Promise<Transcription> {
    const transcription = this.repo.create({
      text,
      recording,
    });
    return await this.repo.save(transcription);
  }
}
