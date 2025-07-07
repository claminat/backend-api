// BACKEND-API/src/modules/media/repositories/media.repository.js

const MongoRepository = require('../../../shared/repositories/MongoRepository');
const mediaSchema = require('../models/media.model');
const { getMongoConnection } = require('../../../shared/connections/multiMongoManager');

class MediaRepository extends MongoRepository {
  constructor() {
    const conn = getMongoConnection('social'); // alias DB
    super(conn, 'SocialNetworkMedia', mediaSchema);
  }


  // Có thể bổ sung thêm các phương thức đặc thù nếu cần
  async findDuplicates() {
    return this.model.find({ duplicate_paths: { $exists: true, $not: { $size: 0 } } });
  }


}

module.exports = new MediaRepository();