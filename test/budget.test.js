import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

let userid;
let budgetId;
let catId;

beforeAll(async () => {
  const userRes = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: "Test User",
      email: `budgettest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    });
  userid = userRes.body.data?.id;

  const catRes = await request(app)
    .post('/api/v1/categories')
    .send({ userId: userid, catName: "Test Category", type: "expense" });
  catId = catRes.body.data?.id;
});

afterAll(async () => {
  if (userid) await request(app).delete(`/api/v1/users/${userid}`);
});

describe('POST /budgets -- creating a budget', () => {
  test('should create a budget successfully', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({ userId: userid, categoryId: catId, amount: 500, period: 'monthly', startDate: '2026-01-01', endDate: '2026-12-31' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    budgetId = res.body.data.id;
  });

  test('should reject if userId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({ categoryId: catId, amount: 500 });
    expect(res.status).toBe(400);
  });

  test('should reject if categoryId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({ userId: userid, amount: 500 });
    expect(res.status).toBe(400);
  });

  test('should reject if amount is missing', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({ userId: userid, categoryId: catId });
    expect(res.status).toBe(400);
  });
});

describe('GET /budgets/:userId -- fetching budgets', () => {
  test('should return budgets for a valid user', async () => {
    const res = await request(app).get(`/api/v1/budgets/${userid}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('should return empty array for user with no budgets', async () => {
    const res = await request(app).get('/api/v1/budgets/99999');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('PUT /budgets/:budgetId -- updating a budget', () => {
  test('should update amount successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/budgets/${budgetId}`)
      .send({ amount: 1000 });
    expect(res.status).toBe(200);
    expect(res.body.data.amount).toBe("1000.00");
  });

  test('should reject if amount is missing', async () => {
    const res = await request(app)
      .put(`/api/v1/budgets/${budgetId}`)
      .send({});
    expect(res.status).toBe(400);
  });

  test('should reject if budget does not exist', async () => {
    const res = await request(app)
      .put('/api/v1/budgets/99999')
      .send({ amount: 500 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /budgets/:budgetId -- deleting a budget', () => {
  test('should reject if budget does not exist', async () => {
    const res = await request(app).delete('/api/v1/budgets/99999');
    expect(res.status).toBe(404);
  });

  test('should delete budget successfully', async () => {
    const res = await request(app).delete(`/api/v1/budgets/${budgetId}`);
    expect(res.status).toBe(200);
    budgetId = null;
  });
});
