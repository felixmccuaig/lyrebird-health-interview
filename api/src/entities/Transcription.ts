// src/entities/Transcription.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Recording } from "./Recording";

@Entity()
export class Transcription {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Recording, (recording) => recording.transcription, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  recording!: Recording;

  @Column({ type: "text" })
  text!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
