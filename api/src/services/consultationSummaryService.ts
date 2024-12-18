// src/services/consultationNoteService.ts

import { Consultation } from "../entities/Consultation";
import { Recording } from "../entities/Recording";
import { Transcription } from "../entities/Transcription";
import { openai } from "../config/openAI";

export const summariseNotes = async (
  consultation: Consultation
): Promise<string> => {
  let combinedContent = `# Consultation Notes: ${consultation.title}\n\n`;
  combinedContent += `**Description:** ${consultation.description}\n\n`;

  // Append User Notes
  if (consultation.note) {
    combinedContent += `## Doctor Consultation Notes\n\n`;
    combinedContent += `${consultation.note.content}\n\n`;
  }

  // Append Transcriptions
  if (consultation.recordings && consultation.recordings.length > 0) {
    combinedContent += `## Transcriptions\n\n`;
    consultation.recordings.forEach((recording: Recording) => {
      const transcription: Transcription = recording.transcription;
      if (transcription && transcription.text) {
        combinedContent += `### Recording: ${recording.filename}\n\n`;
        combinedContent += `${transcription.text}\n\n`;
      }
    });
  }

  const response = await openai.chat.completions
    .create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a medical assistant. Summarize the following consultation notes concisely and professionally.",
        },
        {
          role: "user",
          content: combinedContent,
        },
      ],
      max_tokens: 1024,
    })
    .withResponse();

  let textResponse: string | null = response.data.choices[0].message.content;
  return textResponse || "";
};
