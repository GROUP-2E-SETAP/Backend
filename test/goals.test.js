import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

let userId;
let goalId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: "Goals Test User",
      email: `goalstest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    });
  userId = res.body.data?.id;
});

afterAll(async () => {
  if (userId) await request(app).delete(`/api/v1/users/${userId}`);
});

describe('POST /goals -- creating a goal', () => {
  test('should create a goal successfully', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ userId, goalName: "Buy a car", targetAmount: 5000, deadline: "2027-01-01" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    goalId = res.body.data.id;
  });

  test('should reject if userId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ goalName: "Buy a car", targetAmount: 5000, deadline: "2027-01-01" });
    expect(res.status).toBe(400);
  });

  test('should reject if goalName is missing', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ userId, targetAmount: 5000, deadline: "2027-01-01" });
    expect(res.status).toBe(400);
  });

  test('should reject if targetAmount is missing', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ userId, goalName: "Buy a car", deadline: "2027-01-01" });
    expect(res.status).toBe(400);
  });

  test('should reject if deadline is missing', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ userId, goalName: "Buy a car", targetAmount: 5000 });
    expect(res.status).toBe(400);
  });

  test('should reject if targetAmount is 0 or negative', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .send({ userId, goalName: "Buy a car", targetAmount: -100, deadline: "2027-01-01" });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /goals -- updating a goal', () => {
  test('should update goal amount successfully', async () => {
    const res = await request(app)
      .patch('/api/v1/goals')
      .send({ goalId, newAmount: 8000 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should reject if goalId is missing', async () => {
    const res = await request(app)
      .patch('/api/v1/goals')
      .send({ newAmount: 8000 });
    expect(res.status).toBe(400);
  });

  test('should reject if newAmount is missing', async () => {
    const res = await request(app)
      .patch('/api/v1/goals')
      .send({ goalId });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /goals -- deleting a goal', () => {
  test('should delete goal successfully', async () => {
    const res = await request(app)
      .delete('/api/v1/goals')
      .send({ goalId });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    goalId = null;
  });

  test('should reject if goalId is missing', async () => {
    const res = await request(app)
      .delete('/api/v1/goals')
      .send({});
    expect(res.status).toBe(500);
  });
});
