// src/__tests__/health.test.ts

import request from "supertest";
import app from "../server";

describe("GET /health", () => {
  it("should return status 200 and OK message", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  });
});
