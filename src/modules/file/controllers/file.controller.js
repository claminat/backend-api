const FileService = require('../services/file.service');

exports.getFiles = async (req, res) => {
  const previews = await FileService.getFiles();
  res.json(previews);
};

