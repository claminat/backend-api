const BaseAdapter = require('../../../shared/adapters/baseAdapter');

const ContentRepository = {
  collectionName: 'contents',
  adapter: null,

  /**
   * Khởi tạo repository với adapter
   * @param {Object} adapter - Database adapter
   */
  initialize: function(adapter) {
    this.adapter = adapter;
  },

  /**
   * Tìm tất cả nội dung với các tùy chọn
   * @param {Object} options - Các tùy chọn (pagination, sort, filter)
   * @param {Function} callback - Callback function(error, contents)
   */
  findAll: function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    const query = {};
    const mongoOptions = {};

    // Xử lý filter
    if (options.status) {
      query.status = options.status;
    }
    if (options.type) {
      query.type = options.type;
    }
    if (options.createdBy) {
      query.createdBy = options.createdBy;
    }

    // Xử lý pagination
    if (options.limit) {
      mongoOptions.limit = parseInt(options.limit);
    }
    if (options.skip) {
      mongoOptions.skip = parseInt(options.skip);
    }

    // Xử lý sort
    if (options.sort) {
      mongoOptions.sort = options.sort;
    } else {
      mongoOptions.sort = { createdAt: -1 }; // Mặc định sort theo ngày tạo mới nhất
    }

    this.adapter.find(this.collectionName, query, mongoOptions, function(error, documents) {
      if (error) {
        return callback(error, null);
      }
      
      const contents = documents.map(function(doc) {
        return ContentRepository._mapToEntity(doc);
      });
      
      callback(null, contents);
    });
  },

  /**
   * Tìm nội dung theo ID
   * @param {string} contentId - ID của nội dung
   * @param {Function} callback - Callback function(error, content)
   */
  findById: function(contentId, callback) {
    const query = { _id: { $oid: contentId } };
    
    this.adapter.findOne(this.collectionName, query, function(error, document) {
      if (error) {
        return callback(error, null);
      }
      
      const content = ContentRepository._mapToEntity(document);
      callback(null, content);
    });
  },

  /**
   * Tìm nội dung theo slug
   * @param {string} slug - Slug của nội dung
   * @param {Function} callback - Callback function(error, content)
   */
  findBySlug: function(slug, callback) {
    const query = { slug: slug };
    
    this.adapter.findOne(this.collectionName, query, function(error, document) {
      if (error) {
        return callback(error, null);
      }
      
      const content = ContentRepository._mapToEntity(document);
      callback(null, content);
    });
  },

  /**
   * Tạo nội dung mới
   * @param {Object} contentData - Dữ liệu nội dung cần tạo
   * @param {Function} callback - Callback function(error, content)
   */
  create: function(contentData, callback) {
    // Chuẩn bị document
    const document = {
      title: contentData.title,
      content: contentData.content,
      slug: contentData.slug,
      type: contentData.type || 'article',
      status: contentData.status || 'draft',
      tags: contentData.tags || [],
      metadata: contentData.metadata || {},
      createdBy: contentData.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    // Thêm vào database
    this.adapter.insertOne(this.collectionName, document, function(error, result) {
      if (error) {
        return callback(error, null);
      }
      
      // Lấy document vừa tạo
      ContentRepository.findById(result.insertedId, callback);
    });
  },

  /**
   * Cập nhật nội dung
   * @param {string} contentId - ID của nội dung
   * @param {Object} updateData - Dữ liệu cần cập nhật
   * @param {Function} callback - Callback function(error, content)
   */
  update: function(contentId, updateData, callback) {
    const query = { _id: { $oid: contentId } };
    const update = {
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    };

    // Cập nhật trong database
    this.adapter.updateOne(this.collectionName, query, update, function(error, result) {
      if (error) {
        return callback(error, null);
      }
      
      if (result.modifiedCount === 0) {
        return callback(null, null); // Không tìm thấy document để cập nhật
      }
      
      // Lấy document đã cập nhật
      ContentRepository.findById(contentId, callback);
    });
  },

  /**
   * Xóa mềm nội dung
   * @param {string} contentId - ID của nội dung
   * @param {Function} callback - Callback function(error, success)
   */
  softDelete: function(contentId, callback) {
    const query = { _id: { $oid: contentId } };
    const update = {
      $set: {
        deletedAt: new Date(),
        status: 'deleted'
      }
    };

    this.adapter.updateOne(this.collectionName, query, update, function(error, result) {
      if (error) {
        return callback(error, false);
      }
      
      callback(null, result.modifiedCount > 0);
    });
  },

  /**
   * Xóa cứng nội dung
   * @param {string} contentId - ID của nội dung
   * @param {Function} callback - Callback function(error, success)
   */
  hardDelete: function(contentId, callback) {
    const query = { _id: { $oid: contentId } };

    this.adapter.deleteOne(this.collectionName, query, function(error, result) {
      if (error) {
        return callback(error, false);
      }
      
      callback(null, result.deletedCount > 0);
    });
  },

  /**
   * Đếm số lượng nội dung
   * @param {Object} query - Điều kiện query
   * @param {Function} callback - Callback function(error, count)
   */
  count: function(query, callback) {
    this.adapter.count(this.collectionName, query || {}, callback);
  },

  /**
   * Map document từ database thành entity
   * @param {Object} document - Document từ database
   * @returns {Object} Content entity
   * @private
   */
  _mapToEntity: function(document) {
    if (!document) return null;
    
    return {
      id: document._id,
      title: document.title,
      content: document.content,
      slug: document.slug,
      type: document.type,
      status: document.status,
      tags: document.tags || [],
      metadata: document.metadata || {},
      createdBy: document.createdBy,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      deletedAt: document.deletedAt,
      
      // Helper methods
      isPublished: function() {
        return this.status === 'published' && !this.deletedAt;
      },
      
      isDraft: function() {
        return this.status === 'draft';
      },
      
      isDeleted: function() {
        return this.deletedAt !== null;
      }
    };
  }
};

// Compatibility Pattern để hỗ trợ cả môi trường Node.js và Google Apps Script
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = ContentRepository;
} else if (typeof window !== 'undefined') {
  // Browser environment
  window.ContentRepository = ContentRepository;
} else {
  // Google Apps Script environment
  this.ContentRepository = ContentRepository;
}
