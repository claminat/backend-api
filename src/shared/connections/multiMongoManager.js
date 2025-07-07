// src/shared/connections/multiMongoManager.js
const mongoose = require('mongoose');
const config = require('../../shared/config');

const connections = {};

const dbConfig = {
  social: config.database.mongo.social,
  main: config.database.mongo.main
};

function getMongoConnection(alias = 'main') {
  if (connections[alias]) return connections[alias];

  const uri = dbConfig[alias];
  if (!uri) throw new Error(`Mongo URI for alias "${alias}" not found`);

  connections[alias] = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return connections[alias];
}

module.exports = { getMongoConnection };
