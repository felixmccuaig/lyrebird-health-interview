// src/services/consultationService.ts

import { ConsultationRepository } from "../repositories/consultationRepository";
import { RecordingRepository } from "../repositories/recordingRepository";
import { TranscriptionRepository } from "../repositories/transcriptionRepository";
import { TranscriptionService } from "./transcriptionService";
import { Consultation } from "../entities/Consultation";
import { NoteRepository } from "../repositories/noteRepository";

export class ConsultationService {
  private consultationRepo: ConsultationRepository;
  private recordingRepo: RecordingRepository;
  private transcriptionRepo: TranscriptionRepository;
  private noteRepo: NoteRepository; // Add NoteRepository
  private transcriptionService: TranscriptionService;

  constructor(
    consultationRepo?: ConsultationRepository,
    recordingRepo?: RecordingRepository,
    transcriptionRepo?: TranscriptionRepository,
    noteRepo?: NoteRepository,
    transcriptionService?: TranscriptionService
  ) {
    // If provided, use the passed repositories/services; otherwise, initialize default instances
    this.consultationRepo = consultationRepo ?? new ConsultationRepository();
    this.recordingRepo = recordingRepo ?? new RecordingRepository();
    this.transcriptionRepo = transcriptionRepo ?? new TranscriptionRepository();
    this.noteRepo = noteRepo ?? new NoteRepository();
    this.transcriptionService =
      transcriptionService ?? new TranscriptionService();
  }

  public async createConsultation(
    title: string,
    description?: string
  ): Promise<Consultation> {
    const consultation = await this.consultationRepo.createConsultation(
      title,
      description
    );

    // Automatically create an empty note for the consultation
    const note = await this.noteRepo.createNote("", consultation.id);
    consultation.note = note;

    return consultation;
  }

  public async getAllConsultations(): Promise<Consultation[]> {
    return await this.consultationRepo.getAllConsultations();
  }

  public async getConsultationById(id: number): Promise<Consultation | null> {
    return await this.consultationRepo.getConsultationById(id);
  }

  public async uploadRecording(
    consultationId: number,
    file: Express.Multer.File
  ): Promise<{ recordingId: number; transcriptionText: string }> {
    const consultation = await this.consultationRepo.getConsultationById(
      consultationId
    );
    if (!consultation) {
      throw new Error("Consultation not found.");
    }

    const recording = await this.recordingRepo.createRecording(
      consultation,
      file.filename,
      `recordings/${file.filename}`,
      file.mimetype,
      file.size
    );

    const transcriptionText = await this.transcriptionService.transcribeAudio(
      file.path
    );

    await this.transcriptionRepo.createTranscription(
      recording,
      transcriptionText
    );

    return { recordingId: recording.id, transcriptionText };
  }
}
