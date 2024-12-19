// src/config/openAI.ts

import OpenAI from "openai";

export var openai: any;

if (process.env.NODE_ENV !== "test") {
  openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });
} else {
  openai = null;
}
