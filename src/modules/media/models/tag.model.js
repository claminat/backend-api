const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialNetworkTagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialNetworkTag', SocialNetworkTagSchema);