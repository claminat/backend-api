// modules/auth/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null }, // Thêm trường resetToken vào schema
  resetTokenExpiration: { type: Date, default: null }, // Thêm trường để lưu thời gian hết hạn của token
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
