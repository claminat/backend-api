// BACKEND-API/src/modules/media/configs/media.table.config.js

module.exports = [
  { key: 'filename', label: 'Tên file', visible: true, order: 1 },
  { key: 'type', label: 'Loại', visible: true, order: 2 },
  { key: 'source_type', label: 'Nguồn', visible: true, order: 3 },
  { key: 'size', label: 'Dung lượng', visible: true, order: 4, format: 'bytes' },
  { key: 'created_at', label: 'Ngày tạo', visible: true, order: 5, format: 'datetime' },
  { key: 'status', label: 'Trạng thái', visible: true, order: 6 }
];
