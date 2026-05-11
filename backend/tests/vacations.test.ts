import "reflect-metadata";
import request from "supertest";
import { DataSource } from "typeorm";
import { User } from "../src/entities/User";
import { VacationRequest } from "../src/entities/VacationRequest";

// In-memory SQLite database for tests
const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [User, VacationRequest],
});

// Dynamically import app after DB is ready
let app: Express.Application;

beforeAll(async () => {
  await TestDataSource.initialize();

  // Override the AppDataSource used by the app with the test one
  jest.mock("../src/config/database", () => ({
    AppDataSource: TestDataSource,
  }));

  // Import app after mocking — avoids real DB init
  const { app: expressApp } = await import("../src/index");
  app = expressApp;

  // Seed one user
  const userRepo = TestDataSource.getRepository(User);
  await userRepo.save({ name: "Test User", role: "Requester" });
});

afterAll(async () => {
  await TestDataSource.destroy();
});

describe("GET /api/health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/vacations", () => {
  it("should create a vacation request with valid data", async () => {
    const res = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-08-01",
      endDate: "2026-08-10",
      reason: "Summer holiday",
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("Pending");
    expect(res.body.id).toBeDefined();
  });

  it("should return 400 if startDate is missing", async () => {
    const res = await request(app).post("/api/vacations").send({
      userId: 1,
      endDate: "2026-08-10",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 if endDate is before startDate", async () => {
    const res = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-08-10",
      endDate: "2026-08-01",
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/vacations", () => {
  it("should return all vacation requests", async () => {
    const res = await request(app).get("/api/vacations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should filter by userId", async () => {
    const res = await request(app).get("/api/vacations?userId=1");
    expect(res.status).toBe(200);
    res.body.forEach((r: VacationRequest) => expect(r.userId).toBe(1));
  });

  it("should return 400 for invalid status filter", async () => {
    const res = await request(app).get("/api/vacations?status=Invalid");
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/vacations/:id/approve", () => {
  it("should approve a pending request", async () => {
    // Create a request first
    const create = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-09-01",
      endDate: "2026-09-05",
    });
    const id = create.body.id;

    const res = await request(app).patch(`/api/vacations/${id}/approve`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Approved");
  });

  it("should return 409 when approving an already approved request", async () => {
    const create = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-10-01",
      endDate: "2026-10-03",
    });
    const id = create.body.id;
    await request(app).patch(`/api/vacations/${id}/approve`);
    const res = await request(app).patch(`/api/vacations/${id}/approve`);
    expect(res.status).toBe(409);
  });
});

describe("PATCH /api/vacations/:id/reject", () => {
  it("should reject a pending request with a comment", async () => {
    const create = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-11-01",
      endDate: "2026-11-05",
    });
    const id = create.body.id;

    const res = await request(app)
      .patch(`/api/vacations/${id}/reject`)
      .send({ comments: "Team is full during this period" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Rejected");
    expect(res.body.comments).toBe("Team is full during this period");
  });

  it("should return 400 when rejecting without a comment", async () => {
    const create = await request(app).post("/api/vacations").send({
      userId: 1,
      startDate: "2026-12-01",
      endDate: "2026-12-05",
    });
    const id = create.body.id;

    const res = await request(app).patch(`/api/vacations/${id}/reject`).send({});
    expect(res.status).toBe(400);
  });

  it("should return 404 for a non-existent request", async () => {
    const res = await request(app)
      .patch("/api/vacations/99999/reject")
      .send({ comments: "Not found test" });
    expect(res.status).toBe(404);
  });
});
