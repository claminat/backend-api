// src/modules/media/tests/media.service.test.js

const mongoose = require('mongoose');
const config = require('../../../shared/config');
const mediaService = require('../services/media.service');

beforeAll(async () => {
  await mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('MediaService', () => {
  test('getAllMedia should return an array', async () => {
    const result = await mediaService.getAllMedia({});
    expect(Array.isArray(result)).toBe(true);
  }, 10000); // timeout 10s
});
