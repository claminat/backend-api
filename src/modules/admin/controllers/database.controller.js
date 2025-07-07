/**
 * DatabaseController.js
 * Controller xử lý các yêu cầu liên quan đến quản lý và giám sát database
 */

const databaseMonitor = require('../../utils/DatabaseMonitor');

class DatabaseController {
  /**
   * Lấy danh sách tất cả các kết nối
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getConnections(req, res) {
    try {
      const connections = databaseMonitor.getAllConnections();
      
      res.status(200).json({
        success: true,
        count: connections.length,
        data: connections
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin báo cáo kết nối tổng hợp
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getConnectionsReport(req, res) {
    try {
      const report = databaseMonitor.getConnectionsReport();
      
      res.status(200).json({
        success: true,
        timestamp: report.timestamp,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Kiểm tra trạng thái tất cả các kết nối
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkAllConnections(req, res) {
    try {
      const results = await databaseMonitor.checkAllConnections();
      
      const summary = {
        total: results.length,
        connected: results.filter(r => r.connected).length,
        disconnected: results.filter(r => !r.connected).length
      };
      
      res.status(200).json({
        success: true,
        timestamp: new Date(),
        summary,
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Kiểm tra trạng thái một kết nối cụ thể
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkConnection(req, res) {
    try {
      const { key } = req.params;
      
      if (!key) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu tham số key'
        });
      }
      
      const result = await databaseMonitor.checkConnection(key);
      
      res.status(200).json({
        success: true,
        timestamp: new Date(),
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin server của một kết nối
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getServerInfo(req, res) {
    try {
      const { key } = req.params;
      
      if (!key) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu tham số key'
        });
      }
      
      const result = await databaseMonitor.getServerInfo(key);
      
      if (result.error) {
        return res.status(400).json({
          success: false,
          error: result.error,
          data: result
        });
      }
      
      res.status(200).json({
        success: true,
        timestamp: new Date(),
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Lấy thông tin database của một kết nối
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDatabaseInfo(req, res) {
    try {
      const { key } = req.params;
      
      if (!key) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu tham số key'
        });
      }
      
      const result = await databaseMonitor.getDatabaseInfo(key);
      
      if (result.error) {
        return res.status(400).json({
          success: false,
          error: result.error,
          data: result
        });
      }
      
      res.status(200).json({
        success: true,
        timestamp: new Date(),
        data: result
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new DatabaseController();