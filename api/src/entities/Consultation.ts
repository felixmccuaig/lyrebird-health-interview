import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Recording } from "./Recording";
import { IsNotEmpty, Length, IsOptional } from "class-validator";
import { Note } from "./Note";
import { ConsultationNote } from "./ConsultationNote";

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  @IsNotEmpty({ message: "Title is required." })
  @Length(3, 255, { message: "Title must be between 3 and 255 characters." })
  title!: string;

  @Column({ type: "text", nullable: true })
  @IsOptional()
  description?: string;

  @OneToMany(() => Recording, (recording) => recording.consultation, {
    cascade: true,
  })
  recordings!: Recording[];

  @OneToOne(() => Note, (note) => note.consultation, {
    cascade: true, // Automatically persist changes to notes
    eager: true, // Automatically load the note with consultation
  })
  note!: Note;

  @OneToOne(
    () => ConsultationNote,
    (consultationNote) => consultationNote.consultation,
    {
      cascade: true, // Automatically persist changes to notes
      eager: true, // Automatically load the note with consultation
    }
  )
  consultationNote!: ConsultationNote;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
