const request = require('supertest');
const app = require('../../../../app');

describe('Media Routes', () => {
  test('GET /api/media/duplicates should return 200', async () => {
    const res = await request(app).get('/api/media/duplicates');
    expect(res.statusCode).toBe(200);
  });
});