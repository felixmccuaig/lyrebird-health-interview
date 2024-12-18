// src/data-source.ts

import dotenv from "dotenv";

import { DataSource } from "typeorm";
import { Consultation } from "./entities/Consultation";
import { Recording } from "./entities/Recording";
import { Transcription } from "./entities/Transcription";
import { Note } from "./entities/Note";
import { ConsultationNote } from "./entities/ConsultationNote";

// Load environment variables from .env file
dotenv.config();

// Destructure environment variables with default values
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT!, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true, // Set to false in production
  logging: false,
  entities: [Consultation, Recording, Transcription, Note, ConsultationNote],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
});
