import { ConsultationService } from "../../../src/services/consultationService";
import { ConsultationRepository } from "../../../src/repositories/consultationRepository";
import { RecordingRepository } from "../../../src/repositories/recordingRepository";
import { TranscriptionRepository } from "../../../src/repositories/transcriptionRepository";
import { NoteRepository } from "../../../src/repositories/noteRepository";
import { TranscriptionService } from "../../../src/services/transcriptionService";
import { Consultation } from "../../../src/entities/Consultation";
import { Note } from "../../../src/entities/Note";

jest.mock("../../../src/repositories/consultationRepository");
jest.mock("../../../src/repositories/recordingRepository");
jest.mock("../../../src/repositories/transcriptionRepository");
jest.mock("../../../src/repositories/noteRepository");
jest.mock("../../../src/services/transcriptionService");

describe("ConsultationService", () => {
  let consultationService: ConsultationService;
  let mockConsultationRepo: jest.Mocked<ConsultationRepository>;
  let mockRecordingRepo: jest.Mocked<RecordingRepository>;
  let mockTranscriptionRepo: jest.Mocked<TranscriptionRepository>;
  let mockNoteRepo: jest.Mocked<NoteRepository>;
  let mockTranscriptionService: jest.Mocked<TranscriptionService>;

  beforeEach(() => {
    mockConsultationRepo = new ConsultationRepository() as jest.Mocked<ConsultationRepository>;
    mockRecordingRepo = new RecordingRepository() as jest.Mocked<RecordingRepository>;
    mockTranscriptionRepo = new TranscriptionRepository() as jest.Mocked<TranscriptionRepository>;
    mockNoteRepo = new NoteRepository() as jest.Mocked<NoteRepository>;
    mockTranscriptionService = new TranscriptionService() as jest.Mocked<TranscriptionService>;

    consultationService = new ConsultationService(
      mockConsultationRepo,
      mockRecordingRepo,
      mockTranscriptionRepo,
      mockNoteRepo,
      mockTranscriptionService
    );
  });

  describe("createConsultation", () => {
    it("should create consultation and an empty note", async () => {
      const fakeConsultation: Consultation = {
        id: 1,
        title: "New Consultation",
        note: {} as Note,
      } as Consultation;

      // Mock createConsultation repo method
      mockConsultationRepo.createConsultation.mockResolvedValue(fakeConsultation);

      // Mock createNote for new consultation
      mockNoteRepo.createNote.mockResolvedValue({ id: 101, content: "" } as Note);

      const result = await consultationService.createConsultation("New Consultation", "Description");

      expect(mockConsultationRepo.createConsultation).toHaveBeenCalledWith(
        "New Consultation",
        "Description"
      );
      expect(mockNoteRepo.createNote).toHaveBeenCalledWith("", 1);
      expect(result.note).toBeDefined();
      expect(result.note.id).toBe(101);
    });
  });

  describe("uploadRecording", () => {
    it("should upload a file and transcribe audio", async () => {
      // Setup
      const mockFile = {
        filename: "audio.mp3",
        path: "/fake/path/audio.mp3",
        mimetype: "audio/mpeg",
        size: 1234,
      } as Express.Multer.File;

      const mockConsultation: Consultation = {
        id: 1,
        title: "Test Consultation",
      } as Consultation;

      mockConsultationRepo.getConsultationById.mockResolvedValue(mockConsultation);

      mockRecordingRepo.createRecording.mockResolvedValue({
        id: 99,
        filename: "audio.mp3",
      } as any);

      mockTranscriptionService.transcribeAudio.mockResolvedValue("Transcribed Text");

      mockTranscriptionRepo.createTranscription.mockResolvedValue({} as any);

      // Act
      const result = await consultationService.uploadRecording(1, mockFile);

      // Assert
      expect(mockConsultationRepo.getConsultationById).toHaveBeenCalledWith(1);
      expect(mockRecordingRepo.createRecording).toHaveBeenCalledWith(
        mockConsultation,
        "audio.mp3",
        "recordings/audio.mp3",
        "audio/mpeg",
        1234
      );
      expect(mockTranscriptionService.transcribeAudio).toHaveBeenCalledWith("/fake/path/audio.mp3");
      expect(mockTranscriptionRepo.createTranscription).toHaveBeenCalledWith(
        { id: 99, filename: "audio.mp3" },
        "Transcribed Text"
      );
      expect(result).toEqual({ recordingId: 99, transcriptionText: "Transcribed Text" });
    });

    it("should throw an error if consultation is not found", async () => {
      mockConsultationRepo.getConsultationById.mockResolvedValue(null);

      await expect(
        consultationService.uploadRecording(999, {} as Express.Multer.File)
      ).rejects.toThrow("Consultation not found.");
    });
  });
});
