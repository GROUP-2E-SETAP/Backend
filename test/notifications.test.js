import { describe, expect, test, beforeAll, afterAll } from 'vitest'

const BASE_URL = "http://localhost:3000/api/v1";
let userId;
let notificationId;

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
      name: "Notification Test User",
      email: `notiftest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    })
  });
  const user = await res.json();
  userId = user.data.id;
});


describe('POST /notifications -- creating a notification', () => {
  test('should create a notification successfully', async () => {
    const res = await api('POST', '/notifications', {
      userId,
      type: "info",
      message: "Test notification"
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    notificationId = body.data._id;

  });

  test('should reject if userId is missing', async () => {
    const res = await api('POST', '/notifications', {
      type: "info",
      message: "Test notification"
    });
    expect(res.status).toBe(400);
  });

  test('should reject if type is missing', async () => {
    const res = await api('POST', '/notifications', {
      userId,
      message: "Test notification"
    });
    expect(res.status).toBe(400);
  });

  test('should reject if message is missing', async () => {
    const res = await api('POST', '/notifications', {
      userId,
      type: "info"
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /notifications/:userId -- fetching notifications', () => {
  test('should return notifications for a valid user', async () => {
    const res = await api('GET', `/notifications/${userId}`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('should return empty array for user with no notifications', async () => {
    const res = await api('GET', '/notifications/99999');
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
  });
});


describe('DELETE /notifications/:notificationId -- deleting a notification', () => {
  test('should reject if notification does not exist', async () => {
    const res = await api('DELETE', '/notifications/99999');
    expect(res.status).toBe(500);
  });

  test('should delete notification successfully', async () => {
    const res = await api('DELETE', `/notifications/${notificationId}`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    notificationId = null;
  });
});
