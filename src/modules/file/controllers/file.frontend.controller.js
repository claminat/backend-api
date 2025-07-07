const path = require('path');
const { getFiles } = require('../services/file.service');

exports.getFiles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { files, total } = await getFiles(page, limit);
  const totalPages = Math.ceil(total / limit);
  const viewPath = path.join(__dirname, '../views/list.ejs');
  res.renderPage(viewPath, {
    files,
    currentPage: page,
    totalPages,
    title: 'File List'
  });
};


