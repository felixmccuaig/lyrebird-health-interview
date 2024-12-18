// src/entities/ConsultationNote.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Consultation } from "./Consultation";

@Entity()
export class ConsultationNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(
    () => Consultation,
    (consultation) => consultation.consultationNote,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "consultation_id" })
  consultation!: Consultation;

  @Column("text")
  generatedContent!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
