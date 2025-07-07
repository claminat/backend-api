const notificationService = require('../services/notification.service');

class NotificationController {
  /**
   * Lấy danh sách thông báo của người dùng
   */
  async getNotifications(req, res) {
    try {
      const result = await notificationService.getNotifications(req.user.id, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  /**
   * Đánh dấu thông báo đã đọc
   */
  async markAsRead(req, res) {
    try {
      const result = await notificationService.markAsRead(req.params.id, req.user.id);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Đã đánh dấu thông báo đã đọc'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead(req, res) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Đã đánh dấu tất cả thông báo đã đọc',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  /**
   * Xóa thông báo
   */
  async deleteNotification(req, res) {
    try {
      const result = await notificationService.deleteNotification(req.params.id, req.user.id);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Xóa thông báo thành công'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      res.status(200).json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }

  /**
   * Gửi thông báo (admin only)
   */
  async sendNotification(req, res) {
    try {
      const result = await notificationService.sendNotification({
        ...req.body,
        senderId: req.user.id
      });
      
      res.status(201).json({
        success: true,
        message: 'Gửi thông báo thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error.message
      });
    }
  }
}

module.exports = new NotificationController();
