import { describe, expect, test, beforeAll, afterAll } from 'vitest'

const BASE_URL = "http://localhost:3000/api/v1";
let userid;
let budgetId;
let catId;

beforeAll(async () => {
  const userRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: `budgettest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    })
  });
  const user = await userRes.json();
  userid = user.data?.id;

  const catRes = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userid, catName: "Test Category", type: "expense" })
  });
  const cat = await catRes.json();
  catId = cat.data?.id;
});

afterAll(async () => {
  if (userid) await fetch(`${BASE_URL}/users/${userid}`, { method: "DELETE" });
});

// helper to reduce boilerplate
const api = (method, path, body) => fetch(`${BASE_URL}${path}`, {
  method,
  headers: { "Content-Type": "application/json" },
  body: body ? JSON.stringify(body) : undefined
});

describe('POST /budgets -- creating a budget', () => {
  test('should create a budget successfully', async () => {
    const res = await api('POST', '/budgets', {
      userId: userid, categoryId: catId, amount: 500,
      period: 'monthly', startDate: '2026-01-01', endDate: '2026-12-31'
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    budgetId = body.data.id;
  });

  test('should reject if userId is missing', async () => {
    const res = await api('POST', '/budgets', { categoryId: catId, amount: 500 });
    expect(res.status).toBe(400);
  });

  test('should reject if categoryId is missing', async () => {
    const res = await api('POST', '/budgets', { userId: userid, amount: 500 });
    expect(res.status).toBe(400);
  });

  test('should reject if amount is missing', async () => {
    const res = await api('POST', '/budgets', { userId: userid, categoryId: catId });
    expect(res.status).toBe(400);
  });
});

describe('GET /budgets/:userId -- fetching budgets', () => {
  test('should return budgets for a valid user', async () => {
    const res = await api('GET', `/budgets/${userid}`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('should return empty array for user with no budgets', async () => {
    const res = await api('GET', '/budgets/99999');
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

describe('PUT /budgets/:budgetId -- updating a budget', () => {
  test('should update amount successfully', async () => {
    const res = await api('PUT', `/budgets/${budgetId}`, { amount: 1000 });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.amount).toBe("1000.00");
  });

  test('should reject if amount is missing', async () => {
    const res = await api('PUT', `/budgets/${budgetId}`, {});
    expect(res.status).toBe(400);
  });

  test('should reject if budget does not exist', async () => {
    const res = await api('PUT', '/budgets/99999', { amount: 500 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /budgets/:budgetId -- deleting a budget', () => {
  test('should reject if budget does not exist', async () => {
    const res = await api('DELETE', '/budgets/99999');
    const data = await res.json();
    expect(res.status).toBe(404);
  });

  test('should delete budget successfully', async () => {
    const res = await api('DELETE', `/budgets/${budgetId}`);
    const data  = await res.json();
    expect(res.status).toBe(200);
    budgetId = null;
  });
});
