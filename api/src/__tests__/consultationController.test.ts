import request from "supertest";

const url = `http://localhost:5000`;

describe("Consultation API Endpoints", () => {
  it("should create a new consultation", async () => {
    const res = await request(url).post("/consultations").send({
      title: "New Consultation",
    });

    expect(res.status).toBe(201);
    expect(res.body.consultation).toHaveProperty("id");
    expect(res.body.consultation.title).toBe("New Consultation");
  });

  it("should fail to create consultation without title", async () => {
    const res = await request(url).post("/consultations").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Title is required." });
  });

  it("should return all consultations", async () => {
    const res = await request(url).get("/consultations");

    expect(res.status).toBe(200);
    expect(res.body.consultations).toBeInstanceOf(Array);
  });

  it("should return 404 for non-existing consultation", async () => {
    const res = await request(url).get("/consultations/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Consultation not found." });
  });
});
