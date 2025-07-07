const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialNetworkPostSchema = new Schema({
  platform: { type: String, enum: ['facebook', 'x', 'instagram', 'threads'], required: true },
  post_id: { type: String, unique: true },
  content: String,
  user: { type: Schema.Types.ObjectId, ref: 'SocialNetworkUser' },
  media: [{ type: Schema.Types.ObjectId, ref: 'SocialNetworkMedia' }],
  created_at: { type: Date }
});

module.exports = mongoose.model('SocialNetworkPost', SocialNetworkPostSchema);