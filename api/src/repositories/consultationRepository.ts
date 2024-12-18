// src/repositories/consultationRepository.ts

import { Repository } from "typeorm";
import { Consultation } from "../entities/Consultation";
import { AppDataSource } from "../data-source";

export class ConsultationRepository {
  private repo: Repository<Consultation>;

  constructor() {
    this.repo = AppDataSource.getRepository(Consultation);
  }

  public async createConsultation(
    title: string,
    description?: string
  ): Promise<Consultation> {
    const consultation = this.repo.create({ title, description });
    return await this.repo.save(consultation);
  }

  public async getAllConsultations(): Promise<Consultation[]> {
    return await this.repo.find({
      relations: ["recordings", "recordings.transcription"],
    });
  }

  public async getConsultationById(id: number): Promise<Consultation | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["recordings", "recordings.transcription"],
    });
  }
}
