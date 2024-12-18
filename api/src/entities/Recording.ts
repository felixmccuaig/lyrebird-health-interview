// src/entities/Recording.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./Consultation";
import { Transcription } from "./Transcription";

@Entity()
export class Recording {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Consultation, (consultation) => consultation.recordings, {
    onDelete: "CASCADE",
  })
  consultation!: Consultation;

  @Column({ length: 255 })
  filename!: string;

  @Column({ length: 500 })
  filepath!: string;

  @Column({ length: 100 })
  mimetype!: string;

  @Column("integer")
  size!: number;

  @OneToOne(() => Transcription, (transcription) => transcription.recording, {
    cascade: true,
  })
  transcription!: Transcription;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
