// modules/auth/repositories/user.repository.js
const MongoRepository = require('../../../shared/repositories/MongoRepository');
const User = require('../models/user.model'); // Import model User

// modules/auth/repositories/user.repository.js
if (!global.RepositoryModule) {
  global.RepositoryModule = {};  // Khởi tạo RepositoryModule toàn cục nếu chưa có
}


RepositoryModule.UserRepository = {
  /**
   * Tìm kiếm người dùng theo email
   * @param {string} email - Email của người dùng
   * @returns {Promise<Object>} - Người dùng tìm được
   */
  findByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  /**
   * Tạo người dùng mới
   * @param {Object} data - Dữ liệu của người dùng
   * @returns {Promise<Object>} - Người dùng đã được tạo
   */
  createUser: async (data) => {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {string} id - ID của người dùng cần cập nhật
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Người dùng đã được cập nhật
   */
  updateUser: async (id, updateData) => {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Xóa người dùng
   * @param {string} id - ID của người dùng cần xóa
   * @returns {Promise<boolean>} - Trả về true nếu xóa thành công, false nếu không tìm thấy
   */
  deleteUser: async (id) => {
    try {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Soft delete user (chỉ đánh dấu đã xóa)
   * @param {string} userId - ID của user
   * @returns {Promise<boolean>} - Trả về true nếu xóa thành công, false nếu không tìm thấy
   */
  softDelete: async (userId) => {
    try {
      const user = await User.findByIdAndUpdate(userId, {
        $set: { status: 'inactive', deletedAt: new Date() },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return true;
    } catch (error) {
      console.error('Error soft deleting user:', error);
      return false;
    }
  },

  /**
   * Hard delete user (xóa hoàn toàn khỏi database)
   * @param {string} userId - ID của user
   * @returns {Promise<boolean>} - Trả về true nếu xóa thành công, false nếu không tìm thấy
   */
  hardDelete: async (userId) => {
    try {
      const user = await User.findByIdAndDelete(userId);
      return user !== null;
    } catch (error) {
      console.error('Error hard deleting user:', error);
      return false;
    }
  },

  /**
   * Tìm tất cả người dùng theo query và options (phân trang, sắp xếp)
   * @param {Object} query - Điều kiện tìm kiếm
   * @param {Object} options - Các tùy chọn như phân trang (page, limit) và sắp xếp (sort)
   * @returns {Promise<Array>} - Mảng các người dùng tìm được
   */
  findAll: async (query = {}, options = {}) => {
    try {
      const mongoRepo = new MongoRepository('users');
      return await mongoRepo.findAll(query, options);
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  },

  /**
   * Tìm một người dùng theo ID
   * @param {string} userId - ID của người dùng
   * @returns {Promise<Object>} - Người dùng tìm được
   */
  findById: async (userId) => {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },
  
  /**
   * Tìm người dùng theo resetToken
   * @param {string} resetToken - Reset token để tìm người dùng
   * @returns {Promise<Object>} - Người dùng tìm được
   */
  findByResetToken: async function(resetToken) {
    try {
      return await User.findOne({ resetToken }); // Giả sử bạn đã lưu resetToken trong User schema
    } catch (error) {
      console.error('Error finding user by resetToken:', error);
      throw error;
    }
  },
};

module.exports = RepositoryModule.UserRepository;
