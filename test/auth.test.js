import { describe, it, expect, afterAll } from "vitest";
import request from 'supertest'
import app from '../src/app.js'

let testEmail = `testuser${Date.now()}@gmail.com`;
let createdUserId;
let accessToken;
let refreshToken;

afterAll(async () => {
  if (createdUserId) await request(app).delete(`/api/v1/users/${createdUserId}`);
});

describe("POST /api/v1/auth/signup", () => {
  it("should signup successfully with valid data", async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: "test", email: testEmail, password: "StrongPass123!" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    createdUserId = res.body.data?.id;
  });

  it("should fail with missing fields", async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: "test" });
    expect(res.status).toBe(400);
  });

  it("should fail with duplicate email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ name: "test", email: testEmail, password: "StrongPass123!" });
    expect(res.status).toBe(500);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: "StrongPass123!" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: "WrongPass123!" });
    expect(res.status).toBe(500);
  });

  it("should fail with non-existent email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: "nobody@example.com", password: "StrongPass123!" });
    expect(res.status).toBe(500);
  });

  it("should fail with missing email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: "StrongPass123!" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/auth/me", () => {
  it("should return current user when authenticated", async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("should fail without auth token", async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});

describe("POST /api/v1/auth/forgot-password", () => {
  it("should return success for existing email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testEmail });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return success for non-existent email (prevents enumeration)", async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: "nobody@example.com" });
    expect(res.status).toBe(200);
  });

  it("should fail with missing email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({});
    expect(res.status).toBe(400);
  });
});
