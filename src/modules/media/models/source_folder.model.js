const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialNetworkSourceFolderSchema = new Schema({
  name: String,
  type: { type: String, enum: ['local', 's3', 'gdrive'], required: true },
  path_or_url: { type: String, required: true },
  active: { type: Boolean, default: true },
  auto_scan: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialNetworkSourceFolder', SocialNetworkSourceFolderSchema);