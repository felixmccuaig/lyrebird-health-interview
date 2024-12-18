// src/repositories/recordingRepository.ts

import { Repository } from "typeorm";
import { Recording } from "../entities/Recording";
import { Consultation } from "../entities/Consultation";
import { AppDataSource } from "../data-source";

export class RecordingRepository {
  private repo: Repository<Recording>;

  constructor() {
    this.repo = AppDataSource.getRepository(Recording);
  }

  public async createRecording(
    consultation: Consultation,
    filename: string,
    filepath: string,
    mimetype: string,
    size: number
  ): Promise<Recording> {
    const recording = this.repo.create({
      filename,
      filepath,
      mimetype,
      size,
      consultation,
    });
    return await this.repo.save(recording);
  }
}
