import express from "express"; // Import types from express
import cors from "cors"; // Import cors
import consultationsRouter from "./routes/consultations";
import consultationSummaryRoutes from "./routes/consultationSummary";
import notesRouter from "./routes/notes";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";

dotenv.config();

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Middleware to parse JSON
    app.use(express.json());

    app.use(
      cors({
        origin: "http://localhost:3000", // Replace with your frontend's origin
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // If you need to send cookies or authentication headers
      })
    );

    app.use("/notes", notesRouter);
    app.use("/consultations", consultationsRouter);
    app.use("/consultations", consultationSummaryRoutes);

    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK" });
    });

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

export default app;
