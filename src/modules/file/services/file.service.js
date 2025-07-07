const FileRepository = require('../repositories/file.repository');

exports.getFiles = async (page, limit) => {
  return FileRepository.getFiles(page, limit);
};
