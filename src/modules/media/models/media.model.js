// BACKEND-API/src/modules/media/models/media.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialNetworkMediaSchema = new Schema({
  filename: String,
  extension: String,
  type: { type: String, enum: ['image', 'video'], required: true },
  source_type: { type: String, enum: ['local', 's3', 'gdrive', 'facebook', 'x', 'instagram', 'threads'], required: true },
  source_path: String,
  user_source: { type: Schema.Types.ObjectId, ref: 'SocialNetworkUser' },
  caption: String,
  size: Number,
  width: Number,
  height: Number,
  mime_type: String,
  created_at: { type: Date, default: Date.now },
  tags: [{ type: Schema.Types.ObjectId, ref: 'SocialNetworkTag' }],
  color_tag: String,
  md5: { type: String, required: true, index: true },
  duplicate_paths: [String],
  status: { type: String, enum: ['new', 'reviewed'], default: 'new' },
  post: { type: Schema.Types.ObjectId, ref: 'SocialNetworkPost' },
  note: String,
});

module.exports = SocialNetworkMediaSchema;
