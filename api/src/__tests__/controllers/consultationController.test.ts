import request from "supertest";
import express from "express";
import { ConsultationController } from "../../../src/controllers/consultationController";
import bodyParser from "body-parser";

jest.mock("../../../src/services/consultationService", () => {
  return {
    ConsultationService: jest.fn().mockImplementation(() => ({
      createConsultation: jest.fn().mockResolvedValue({
        id: 1,
        title: "Test Title",
        description: "Test Description",
        note: { id: 101, content: "" },
      }),
    })),
  };
});

describe("ConsultationController", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.post("/consultations", ConsultationController.createConsultation);
  });

  it("POST /consultations should return 201 on success", async () => {
    const response = await request(app).post("/consultations").send({
      title: "Test Title",
      description: "Test Description",
    });
    expect(response.status).toBe(201);
    expect(response.body.consultation).toBeDefined();
    expect(response.body.consultation.id).toBe(1);
  });

  it("POST /consultations should return 400 if title is missing", async () => {
    const response = await request(app).post("/consultations").send({
      // no title
      description: "Test Description",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title is required.");
  });
});
