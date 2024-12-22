import { TranscriptionService } from "../../../src/services/transcriptionService";
import axios from "axios";
import fs from "fs";

jest.mock("axios");

describe("TranscriptionService", () => {
  let transcriptionService: TranscriptionService;

  beforeAll(() => {
    // For test environment, we typically set the API key in our .env.test or set it in the test config
    process.env.OPENAI_API_KEY = "test_api_key";
  });

  afterAll(() => {
    delete process.env.OPENAI_API_KEY;
  });

  beforeEach(() => {
    transcriptionService = new TranscriptionService();
  });

  it("should throw error if OPENAI_API_KEY is not set and NODE_ENV is not test", () => {
    // We simulate a non-test environment missing the API key
    delete process.env.OPENAI_API_KEY;
    delete process.env.NODE_ENV; // Make sure it's not 'test'
    expect(() => new TranscriptionService()).toThrow("OpenAI API key not configured.");

    // Reset it back for the rest of the tests
    process.env.OPENAI_API_KEY = "test_api_key";
    process.env.NODE_ENV = "test";
  });

  it("should call the OpenAI API with correct params and return transcription text", async () => {
    const mockResponse = { data: { text: "Transcribed text" } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    // We can mock fs.createReadStream as well
    jest.spyOn(fs, "createReadStream").mockReturnValue("mockStream" as any);

    const result = await transcriptionService.transcribeAudio("/path/to/file");

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toBe("Transcribed text");
  });

  it("should throw an error when the API call fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("API Error"));
    jest.spyOn(fs, "createReadStream").mockReturnValue("mockStream" as any);

    await expect(
      transcriptionService.transcribeAudio("/path/to/file")
    ).rejects.toThrow("Transcription failed.");
  });
});
