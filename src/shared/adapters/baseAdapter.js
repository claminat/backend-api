/**
 * BaseAdapter.js
 * Lớp cơ sở trừu tượng cho tất cả các adapter
 */

class BaseAdapter {
  /**
   * Khởi tạo adapter với các thông số cấu hình cần thiết
   * @param {Object} config - Cấu hình kết nối
   */
  constructor(config) {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter là lớp trừu tượng, không thể khởi tạo trực tiếp');
    }
    this.config = config;
    this.connection = null;
  }

  /**
   * Kết nối đến nguồn dữ liệu
   * @returns {Promise<any>} - Kết nối đến nguồn dữ liệu
   */
  async connect() {
    throw new Error('Phương thức connect() cần được triển khai bởi lớp con');
  }

  /**
   * Ngắt kết nối từ nguồn dữ liệu
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error('Phương thức disconnect() cần được triển khai bởi lớp con');
  }

  /**
   * Kiểm tra trạng thái kết nối
   * @returns {Promise<boolean>} - true nếu đã kết nối, false nếu chưa
   */
  async isConnected() {
    throw new Error('Phương thức isConnected() cần được triển khai bởi lớp con');
  }

  /**
   * Thực hiện một thao tác trên nguồn dữ liệu
   * @param {Function} operation - Hàm thực hiện thao tác
   * @returns {Promise<any>} - Kết quả của thao tác
   */
  async executeOperation(operation) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      return await operation(this.connection);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseAdapter;