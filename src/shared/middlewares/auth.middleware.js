const tokenHelper = require('../helpers/token.helper');

const authMiddleware = {
  /**
   * Middleware xác thực người dùng
   */
  authenticate: (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token không được cung cấp'
        });
      }

      const decoded = tokenHelper.verifyToken(token); // Sử dụng verifyToken
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Token không hợp lệ'
        });
      }

      req.user = decoded;  // Gán thông tin người dùng vào req.user
      console.log('auth.middleware.req.user:', decoded);  // Log để kiểm tra token
      console.log(req.user);
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Xác thực thất bại',
        error: error.message
      });
    }
  },

  /**
   * Middleware kiểm tra quyền theo role
   */
  requireRole: (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
      }

      if (!req.user.roles || !req.user.roles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      next();
    };
  },

  /**
   * Middleware kiểm tra quyền admin
   */
  requireAdmin: (req, res, next) => {
    return authMiddleware.requireRole('admin')(req, res, next);
  },

  /**
   * Middleware tùy chọn - không bắt buộc xác thực
   * Nếu có token thì xác thực và gán thông tin người dùng vào req.user, nếu không có token thì bỏ qua.
   */
  optional: (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        const decoded = tokenHelper.verifyToken(token);
        if (decoded) {
          req.user = decoded;  // Gán thông tin người dùng vào req.user
        }
      }
      
      next();
    } catch (error) {
      // Bỏ qua lỗi và tiếp tục
      next();
    }
  }
};

module.exports = authMiddleware;
