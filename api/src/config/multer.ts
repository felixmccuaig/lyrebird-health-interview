// src/config/multer.ts

import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const allowedExtensions: string[] = [".wav", ".mp3", ".ogg", ".m4a"];
const allowedMimetypes: string[] = [
  "audio/wav",
  "audio/mpeg",
  "audio/ogg",
  "audio/mp4",
];
const uploadDirectory: string = path.join(__dirname, "../../recordings");

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDirectory);
  },
  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix: string = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const extension: string = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  console.log(`Uploading file: ${file.originalname}`);
  console.log(`Extension: ${ext}`);
  console.log(`MIME type: ${mimetype}`);

  if (allowedExtensions.includes(ext) && allowedMimetypes.includes(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: fileFilter,
});

export default upload;
