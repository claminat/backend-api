const path = require('path');

const { getAll ,search} = require('../services/media.service');


const tableConfig = require('../configs/media.table.config');


exports.list = async (req, res) => {
  const { items, pagination } = await search(req.query);
  const viewPath = path.join(__dirname, '../views/list.ejs');

  res.renderPage(viewPath, {
    title: 'Media Files',
    description: 'Danh sách media',
    items,
    columns: tableConfig,
    pagination,
    totalItems: pagination.total,
    search: req.query.search || '' // ✅ truyền xuống view để giữ lại giá trị input
  });
};



// ✅ Hiển thị media trùng lặp
exports.duplicate = async (req, res) => {
  const items = await getAll();
  const duplicates = items.filter(m => (m.duplicate_paths || []).length > 0);
  res.renderPage('media/views/duplicate', {
    title: 'Duplicate Media',
    description: 'Media bị trùng',
    items: duplicates
  });
};


