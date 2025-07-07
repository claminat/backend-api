const mongoose = require('mongoose');
const config = require('../../../shared/config');
const Media = require('../models/media.model');
const MediaRepository = require('../repositories/media.repository');

describe('MediaRepository', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should import media from local adapter', async () => {
    const repository = new MediaRepository({
      mediaModel: Media,
      config: {
        local: { folders: config.media?.localFolders || ['./media-sample'] }
      }
    });

    const result = await repository.importFrom('local');
    console.log(result);
    expect(Array.isArray(result)).toBe(true);
  });
});