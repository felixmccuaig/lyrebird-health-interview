// src/entities/Note.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./Consultation";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @OneToOne(() => Consultation, (consultation) => consultation.note, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  consultation!: Consultation;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
