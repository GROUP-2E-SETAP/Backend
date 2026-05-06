import { log } from "console";
import { describe, it, expect } from "vitest";

describe("POST /api/v1/auth/signup", () => {
  const BASE_URL = "http://localhost:3000/api/v1/auth";
  
  let testEmail = `testuser${Date.now()}@gmail.com`;

  it("should signup successfully with valid data", async () => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test",
        email: testEmail,
        password: "StrongPass123!"
      })
    });
    
    const data = await res.json();
    
    expect(res.status).toBe(201);
    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("refreshToken"); 
  });

  it("should fail with missing fields", async () => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test" })
    });

    expect(res.status).toBe(400);
  });

  it("should fail with duplicate email", async () => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test",
        email: testEmail,
        password: "StrongPass123!"
      })
    });

    const data = await res.json();
    expect(res.status).toBe(500);
  });
});
