require('dotenv').config();
const request = require('supertest');
const app = require('../server');
const { pool, initDb } = require('../db');

beforeAll(async () => {
  await initDb();
});

afterAll(async () => {
  await pool.end();
});

describe('GET /health', () => {
  test('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /messages and GET /messages', () => {
  test('stores a message and returns it in the list', async () => {
    const content = `Integration test message ${Date.now()}`;

    const postRes = await request(app)
      .post('/messages')
      .send({ message: content });

    expect(postRes.status).toBe(201);
    expect(postRes.body.message).toBe(content);

    const getRes = await request(app).get('/messages');

    expect(getRes.status).toBe(200);
    const saved = getRes.body.find((m) => m.message === content);
    expect(saved).toBeDefined();
  });

  test('rejects an empty message', async () => {
    const res = await request(app).post('/messages').send({ message: '   ' });
    expect(res.status).toBe(400);
  });
});
