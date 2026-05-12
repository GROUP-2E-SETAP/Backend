import { describe, it, expect, beforeAll, afterAll } from "vitest";
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
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
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
    expect([409, 500]).toContain(res.status);
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
    expect([401, 500]).toContain(res.status);
  });

  it("should fail with non-existent email", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: "nobody@example.com", password: "StrongPass123!" });
    expect([401, 500]).toContain(res.status);
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

describe("PUT /api/v1/auth/change-password", () => {
  it("should fail with missing fields", async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')  // PUT not POST
      .set('Authorization', `Bearer ${accessToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("should fail without auth token", async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ currentPassword: "StrongPass123!", newPassword: "NewPass123!" });
    expect(res.status).toBe(401);
  });

  it("should fail with wrong current password", async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: "WrongPass123!", newPassword: "NewPass123!" });
    expect([401, 500]).toContain(res.status);
  });

  it("should change password successfully", async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: "StrongPass123!", newPassword: "NewPass123!" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("should fail without auth token", async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({});
    expect(res.status).toBe(401); // logout requires authenticate middleware
  });

  it("should logout successfully with valid token", async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
