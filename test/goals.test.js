import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import { login } from '../src/controllers/authController';

const BASE_URL = "http://localhost:3000/api/v1";
let userId;
let goalId;

const api = (method, path, body) => fetch(`${BASE_URL}${path}`, {
  method,
  headers: { "Content-Type": "application/json" },
  body: body ? JSON.stringify(body) : undefined
});

beforeAll(async () => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Goals Test User",
      email: `goalstest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    })
  });
  const user = await res.json();
  userId = user.data?.id;
});

afterAll(async () => {
  if (userId) await api('DELETE', `/users/${userId}`);
});

describe('POST /goals -- creating a goal', () => {
  test('should create a goal successfully', async () => {
    const res = await api('POST', '/goals', {
      userId,
      goalName: "Buy a car",
      targetAmount: 5000,
      deadline: "2027-01-01"
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    goalId = body.data.id;
  });

  test('should reject if userId is missing', async () => {
    const res = await api('POST', '/goals', {
      goalName: "Buy a car",
      targetAmount: 5000,
      deadline: "2027-01-01"
    });
    expect(res.status).toBe(400);
  });

  test('should reject if goalName is missing', async () => {
    const res = await api('POST', '/goals', {
      userId,
      targetAmount: 5000,
      deadline: "2027-01-01"
    });
    expect(res.status).toBe(400);
  });

  test('should reject if targetAmount is missing', async () => {
    const res = await api('POST', '/goals', {
      userId,
      goalName: "Buy a car",
      deadline: "2027-01-01"
    });
    expect(res.status).toBe(400);
  });

  test('should reject if deadline is missing', async () => {
    const res = await api('POST', '/goals', {
      userId,
      goalName: "Buy a car",
      targetAmount: 5000
    });
    expect(res.status).toBe(400);
  });

  test('should reject if targetAmount is 0 or negative', async () => {
    const res = await api('POST', '/goals', {
      userId,
      goalName: "Buy a car",
      targetAmount: -100,
      deadline: "2027-01-01"
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /goals -- updating a goal', () => {
  test('should update goal amount successfully', async () => {
    const res = await api('PATCH', '/goals', {
      goalId,
      newAmount: 8000
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  test('should reject if goalId is missing', async () => {
    const res = await api('PATCH', '/goals', { newAmount: 8000 });
    expect(res.status).toBe(400);
  });

  test('should reject if newAmount is missing', async () => {
    const res = await api('PATCH', '/goals', { goalId });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /goals -- deleting a goal', () => {
  test('should delete goal successfully', async () => {
    const res = await api('DELETE', '/goals', { goalId });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    goalId = null;
  });

  test('should reject if goalId is missing', async () => {
    const res = await api('DELETE', '/goals', {});
    const body = await res.json();
    console.log(body);
    expect(res.status).toBe(500);
  });
});
