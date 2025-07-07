const contentService = require('../services/content.service');
const contentValidator = require('../validators/content.validator');

class ContentController {
  /**
   * Lấy danh sách nội dung
   */
  async getContents(req, res) {
    try {
      const result = await contentService.getContents(req.query);
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
   * Lấy chi tiết một nội dung
   */
  async getContent(req, res) {
    try {
      const result = await contentService.getContent(req.params.id);
      if (result) {
        res.status(200).json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy nội dung'
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
   * Tạo nội dung mới
   */
  async createContent(req, res) {
    try {
      // Validate input
      const validationResult = contentValidator.validateCreate(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validationResult.errors
        });
      }

      const result = await contentService.createContent({
        ...req.body,
        createdBy: req.user.id
      });
      
      res.status(201).json({
        success: true,
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
   * Cập nhật nội dung
   */
  async updateContent(req, res) {
    try {
      // Validate input
      const validationResult = contentValidator.validateUpdate(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validationResult.errors
        });
      }

      const result = await contentService.updateContent(req.params.id, {
        ...req.body,
        updatedBy: req.user.id
      });

      if (result) {
        res.status(200).json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy nội dung'
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
   * Xóa nội dung
   */
  async deleteContent(req, res) {
    try {
      const result = await contentService.deleteContent(req.params.id);
      
      if (result) {
        res.status(200).json({
          success: true,
          message: 'Xóa nội dung thành công'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy nội dung'
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
}

module.exports = new ContentController();
