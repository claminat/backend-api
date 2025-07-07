const crypto = require('crypto');
const path = require('path');
const config = require('../../../shared/config');
const FileHelper = require('../../../shared/helpers/file.helper');

function calculateMd5(filePath) {
  return crypto.createHash('md5').update(filePath).digest('hex');
}

function getExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase();
}

class FileRepository {
  async getFiles(page = 1, limit = 10) {
    const results = [];
    const folders = config.bucket.local || [];

    for (const folder of folders) {
      const files = await FileHelper.listAllFilesRecursively(folder);

      // Lấy stats của toàn bộ files
      const filesWithStats = await Promise.all(files.map(async (filePath) => {
        const stats = await FileHelper.getFileStats(filePath);
        return {
          filePath,
          birthtimeMs: stats.birthtimeMs
        };
      }));

      // Sắp xếp theo thời gian tạo mới nhất
      filesWithStats.sort((a, b) => b.birthtimeMs - a.birthtimeMs);

      // Phân trang
      const start = (page - 1) * limit;
      const end = start + limit;
      const pagedFiles = filesWithStats.slice(start, end);

      // Tạo kết quả chi tiết
      for (const file of pagedFiles) {
        const stats = await FileHelper.getFileStats(file.filePath);
        results.push({
          filename: path.basename(file.filePath),
          extension: getExtension(file.filePath),
          type: 'video',
          source_type: 'local',
          source_path: file.filePath,
          size: stats.size,
          created_at: stats.birthtime,
          tags: [],
          md5: calculateMd5(file.filePath),
          duplicate_paths: [],
          status: 'new',
        });
      }

      // Chỉ xử lý 1 folder theo như hiện tại
      return {
        files: results,
        total: files.length
      };
    }

    // Fallback nếu không có folder nào
    return {
      files: [],
      total: 0
    };
  }
}

module.exports = new FileRepository();
