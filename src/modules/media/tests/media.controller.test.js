const request = require('supertest');
const app = require('../../../../app');

describe('MediaController', () => {
  test('GET /api/media should return 200', async () => {
    const res = await request(app).get('/api/media');
    expect(res.statusCode).toBe(200);
  });
});