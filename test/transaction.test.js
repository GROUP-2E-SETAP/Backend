import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Transactions API", () => {
  const BASE_URL = "http://localhost:3000/api/v1";
  let createdTransactionId;
  let testUserId;
  let testCategoryId;

  beforeAll(async () => {
    // create a user
    const userRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `trxtest_${Date.now()}@example.com`,
        password: "StrongPass123!"
      })
    });
    const user = await userRes.json();
    testUserId = user.data?.id;
    
    // create a category
    const catRes = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: testUserId,
        catName: "Test Category",
        type: "expense"
      })
    });
    const cat = await catRes.json();
    testCategoryId = cat.data?.id;
  });
  
  describe("POST /transactions", () => {
    it("should create a transaction with valid data", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: testUserId,
          categoryId: testCategoryId,
          amount: 100,
          description: "test transaction",
        })
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.user_id).toBe(testUserId); 
      expect(data.data.amount).toBe('100.00');
      createdTransactionId = data.data.id;
    });


    it("should fail without userId", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: testCategoryId, amount: 100 })
      });
      expect(res.status).toBe(400);
    });

    it("should fail without categoryId", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: testUserId, amount: 100 })
      });
      expect(res.status).toBe(400);
    });

    it("should fail without amount", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: testUserId, categoryId: testCategoryId })
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /transactions/:userId", () => {
    it("should fetch transactions for a valid userId", async () => {
      const res = await fetch(`${BASE_URL}/transactions/3`);

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should return empty array for userId with no transactions", async () => {
      const res = await fetch(`${BASE_URL}/transactions/99999`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe("DELETE /transactions/:transactionId", () => {
    it("should delete an existing transaction", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "DELETE",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({transactionId : createdTransactionId})
      });

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.data).toHaveProperty("id");
    });

    it("should fail without transactionId", async () => {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      expect(res.status).toBe(400);
    });
  });

});
