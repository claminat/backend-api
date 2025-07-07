// mongo.adapter.js
const BaseAdapter = require('../baseAdapter');
const mongoose = require('mongoose');

class MongoAdapter extends BaseAdapter {
  async connect() {
    this.connection = await mongoose.connect(this.config.uri);
    return this.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
    this.connection = null;
  }

  async isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = MongoAdapter;
