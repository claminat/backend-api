// Xử lý token
// src/shared/helpers/token.helper.js
const jwt = require('jsonwebtoken');
const config = require('../config');

// Hàm giải mã token JWT và trả về thông tin người dùng
const verifyToken = (token) => {
  try {
    // Giải mã token và lấy thông tin người dùng
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;  // Trả về thông tin giải mã
  } catch (error) {
    console.error('Token không hợp lệ:', error);
    return null;  // Nếu token không hợp lệ, trả về null
  }
};

module.exports = { verifyToken };

