import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { initMongoDb } from '../src/config/mongoDb.js';

let userId;
let notificationId;

beforeAll(async () => {
  await initMongoDb(); // idk why mongoDb wasnt getting initialed so im doing it manually 
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: "Notification Test User",
      email: `notiftest_${Date.now()}@example.com`,
      password: "StrongPass123!"
    });
  userId = res.body.data?.id;
});

afterAll(async () => {
  if (userId) await request(app).delete(`/api/v1/users/${userId}`);
});

describe('POST /notifications -- creating a notification', () => {
  test('should create a notification successfully', async () => {
    const res = await request(app)
      .post('/api/v1/notifications')
      .send({ userId, type: "info", message: "Test notification" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    notificationId = res.body.data._id;
  });

  test('should reject if userId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/notifications')
      .send({ type: "info", message: "Test notification" });
    expect(res.status).toBe(400);
  });

  test('should reject if type is missing', async () => {
    const res = await request(app)
      .post('/api/v1/notifications')
      .send({ userId, message: "Test notification" });
    expect(res.status).toBe(400);
  });

  test('should reject if message is missing', async () => {
    const res = await request(app)
      .post('/api/v1/notifications')
      .send({ userId, type: "info" });
    expect(res.status).toBe(400);
  });
});

describe('GET /notifications/:userId -- fetching notifications', () => {
  test('should return notifications for a valid user', async () => {
    const res = await request(app).get(`/api/v1/notifications/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('should return empty array for user with no notifications', async () => {
    const res = await request(app).get('/api/v1/notifications/99999');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('PUT /notifications/:notificationId -- markinga a notifications ' , ()=>{

  test('should mark notification as read successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/notifications/${notificationId}/read`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should fail with non existend notificationId ', async () =>{
    const res = await request(app)
      .put('/api/v1/notifications/99999/read');
    expect([400, 404, 500]).toContain(res.status);
  });
});

describe('DELETE /notifications/:notificationId -- deleting a notification', () => {
  test('should reject if notification does not exist', async () => {
    const res = await request(app).delete('/api/v1/notifications/99999');
    expect(res.status).toBe(500);
  });

  test('should delete notification successfully', async () => {
    const res = await request(app).delete(`/api/v1/notifications/${notificationId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    notificationId = null;
  });
});
