import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from 'supertest'
import app from '../src/app.js'

let createdTransactionId;
let testUserId;
let testCategoryId;

beforeAll(async () => {
  const userRes = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: "Test User",
      email: `trxtest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    });
  testUserId = userRes.body.data?.id;

  const catRes = await request(app)
    .post('/api/v1/categories')
    .send({ userId: testUserId, catName: "Test Category", type: "expense" });
  testCategoryId = catRes.body.data?.id;
});

afterAll(async () => {
  if (testUserId) await request(app).delete(`/api/v1/users/${testUserId}`);
});

describe("Transactions API", () => {
  describe("POST /transactions", () => {
    it("should create a transaction with valid data", async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ userId: testUserId, categoryId: testCategoryId, amount: 100, description: "test transaction" });
      console.log(res.body.data); 
      console.log(res.body); 
      expect(res.status).toBe(200);
      expect(res.body.data.user_id).toBe(testUserId);
      expect(res.body.data.amount).toBe('100.00');
      createdTransactionId = res.body.data.id;
    });

    it("should fail without userId", async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ categoryId: testCategoryId, amount: 100 });
      expect(res.status).toBe(400);
    });

    it("should fail without categoryId", async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ userId: testUserId, amount: 100 });
      expect(res.status).toBe(400);
    });

    it("should fail without amount", async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ userId: testUserId, categoryId: testCategoryId });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /transactions/:userId", () => {
    it("should fetch transactions for a valid userId", async () => {
      const res = await request(app).get(`/api/v1/transactions/${testUserId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return empty array for userId with no transactions", async () => {
      const res = await request(app).get('/api/v1/transactions/99999');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("DELETE /transactions/:transactionId", () => {
    it("should delete an existing transaction", async () => {
      const res = await request(app)
        .delete('/api/v1/transactions')
        .send({ transactionId: createdTransactionId });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id");
    });

    it("should fail without transactionId", async () => {
      const res = await request(app)
        .delete('/api/v1/transactions')
        .send({});
      expect(res.status).toBe(400);
    });
  });
});
