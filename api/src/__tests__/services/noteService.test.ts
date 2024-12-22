import { NoteService } from "../../../src/services/noteService";
import { NoteRepository } from "../../../src/repositories/noteRepository";
import { Note } from "../../../src/entities/Note";

jest.mock("../../../src/repositories/noteRepository");

describe("NoteService", () => {
  let noteService: NoteService;
  let mockNoteRepo: jest.Mocked<NoteRepository>;

  beforeEach(() => {
    mockNoteRepo = new NoteRepository() as jest.Mocked<NoteRepository>;
    noteService = new NoteService();
    // Override the instance with the mocked repo
    (noteService as any).noteRepo = mockNoteRepo;
  });

  it("should return note if found for the given consultation", async () => {
    const fakeNote: Note = { id: 1, content: "Existing note", consultation: {} as any } as Note;
    mockNoteRepo.getNoteByConsultationId.mockResolvedValue(fakeNote);

    const result = await noteService.getNote(999);
    expect(mockNoteRepo.getNoteByConsultationId).toHaveBeenCalledWith(999);
    expect(result).toBe(fakeNote);
  });

  it("should create a new note if none exists for consultation", async () => {
    mockNoteRepo.getNoteByConsultationId.mockResolvedValue(null);
    mockNoteRepo.createNote.mockResolvedValue({ id: 2, content: "New note", consultation: {} as any } as Note);

    const result = await noteService.createOrUpdateNote(999, "New note content");
    expect(mockNoteRepo.createNote).toHaveBeenCalledWith("New note content", 999);
    expect(result.id).toBe(2);
    expect(result.content).toBe("New note");
  });

  it("should update existing note if found for consultation", async () => {
    const existingNote: Note = { id: 1, content: "Existing note", consultation: {} as any } as Note;
    mockNoteRepo.getNoteByConsultationId.mockResolvedValue(existingNote);
    mockNoteRepo.updateNote.mockResolvedValue({ ...existingNote, content: "Updated content" });

    const result = await noteService.createOrUpdateNote(999, "Updated content");
    expect(mockNoteRepo.updateNote).toHaveBeenCalledWith(1, "Updated content");
    expect(result.content).toBe("Updated content");
  });
});
