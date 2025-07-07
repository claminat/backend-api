function formatDate(date) {
  return new Date(date).toLocaleString('vi-VN');  // bạn có thể tuỳ chỉnh thêm
}
module.exports = { formatDate };
