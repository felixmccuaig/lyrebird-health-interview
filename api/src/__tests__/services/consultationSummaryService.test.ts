import { summariseNotes } from "../../../src/services/consultationSummaryService";
import { openai } from "../../../src/config/openAI";
import { Consultation } from "../../../src/entities/Consultation";
import { Recording } from "../../../src/entities/Recording";
import { Transcription } from "../../../src/entities/Transcription";
import { Note } from "../../../src/entities/Note";

jest.mock("../../../src/config/openAI", () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn().mockReturnThis(),
        withResponse: jest.fn(),
      },
    },
  },
}));

describe("summariseNotes", () => {
  it("should return the summary from OpenAI", async () => {
    // Arrange
    const mockConsultation: Consultation = {
      id: 1,
      title: "Test Consultation",
      description: "Test description",
      note: { id: 100, content: "Doctor's note" } as Note,
      recordings: [
        {
          id: 10,
          filename: "audio.mp3",
          transcription: { id: 5, text: "Sample transcription" } as Transcription,
        } as Recording,
      ],
      consultationNote: null as any,
    } as Consultation;

    // Mock the OpenAI response
    const mockOpenAIResponse = {
      data: {
        choices: [
          {
            message: { content: "Mock summarised content" },
          },
        ],
      },
    };
    (openai.chat.completions.withResponse as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    // Act
    const summary = await summariseNotes(mockConsultation);

    // Assert
    expect(summary).toBe("Mock summarised content");
    expect(openai.chat.completions.create).toHaveBeenCalled();
    expect(openai.chat.completions.withResponse).toHaveBeenCalled();
  });

  it("should return empty string if no summary is provided", async () => {
    // Setup a scenario where the API does not return a valid message
    (openai.chat.completions.withResponse as jest.Mock).mockResolvedValue({
      data: { choices: [{ message: { content: null } }] },
    });

    const mockConsultation: Consultation = {
      id: 1,
      title: "Test Consultation",
      description: "Test description",
      note: {} as Note,
      recordings: [],
      consultationNote: null as any,
      created_at: new Date(),
      updated_at: new Date()
    } as Consultation;

    const summary = await summariseNotes(mockConsultation);

    expect(summary).toBe("");
  });
});
