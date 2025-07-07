const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialNetworkUserSchema = new Schema({
  platform: { type: String, enum: ['facebook', 'x', 'instagram', 'threads'], required: true },
  username: String,
  fullname: String,
  avatar_url: String,
  profile_url: String
});

module.exports = mongoose.model('SocialNetworkUser', SocialNetworkUserSchema);