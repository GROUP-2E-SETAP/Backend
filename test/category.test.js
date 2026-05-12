import { describe, expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { response } from 'express';

const API = '/api/v1/categories';
let categoryId;
let userId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: 'Category Test User',
      email: `cattest_${Date.now()}@example.com`,
      password: 'StrongPass123!'
    });
  userId = res.body.data?.id;
});

afterAll(async () => {
  if (userId) await request(app).delete(`/api/v1/users/${userId}`);
});

describe(`POST ${API}`, () => {
  test('should create a category successfully', async () => {
    const res = await request(app)
      .post(API)
      .send({ userId, catName: 'Movies', type: 'expense' })
      .expect(200);
    expect(res.body.success).toBe(true);
    categoryId = res.body.data.id;
  });

  test('should fail if userId is missing', async () => {
    const res = await request(app)
      .post(API)
      .send({ catName: 'Movies', type: 'expense' })
      .expect(400);
  });

  test('should fail if catName is missing', async () => {
    const res = await request(app)
      .post(API)
      .send({ userId, type: 'expense' })
      .expect(400);
  });

  test('should fail if type is missing', async () => {
    const res = await request(app)
      .post(API)
      .send({ userId, catName: 'Movies' })
      .expect(400);
  });

});

describe(`GET ${API}/:userId`, () => {
  test('should return all categories for a user', async () => {
    const res = await request(app)
      .get(`${API}/${userId}`)
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  test('should return empty or success for user with no categories', async () => {
    const res = await request(app)
      .get(`${API}/99999`)
      .expect(200);
    expect(res.body.success).toBe(true);
  });

});

describe(`DELETE ${API}`, () => {
  test('should delete the category', async () => {
    const res = await request(app)
      .delete(API)
      .send({ catId: categoryId })
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  test('should fail if catId is missing ', async()=>{
    const rest = await request(app)
    .delete(API)
    .send({})
    .expect([400,404,500])
  });



});
