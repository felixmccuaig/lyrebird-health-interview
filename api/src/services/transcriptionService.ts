// src/services/transcriptionService.ts

import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

export interface TranscriptionResponse {
  text: string;
}

export class TranscriptionService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured.");
    }
  }

  public async transcribeAudio(filePath: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post<TranscriptionResponse>(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            ...formData.getHeaders(),
          },
        }
      );

      return response.data.text;
    } catch (error: any) {
      console.error(
        "Error transcribing audio:",
        error.response?.data || error.message
      );
      throw new Error("Transcription failed.");
    }
  }
}
