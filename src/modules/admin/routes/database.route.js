/**
 * Routes quản lý và giám sát database
 */

const express = require('express');
const router = express.Router();
const databaseController = require('../../controllers/admin/DatabaseController');
const { authenticate, authorize } = require('../../middleware/auth/authenticate');

// Thêm middleware xác thực nếu cần
// router.use(authenticate);
// router.use(authorize(['admin']));

// Lấy danh sách tất cả các kết nối
router.get('/connections', databaseController.getConnections);

// Lấy báo cáo kết nối tổng hợp
router.get('/connections/report', databaseController.getConnectionsReport);

// Kiểm tra trạng thái tất cả các kết nối
router.get('/connections/check', databaseController.checkAllConnections);

// Kiểm tra trạng thái một kết nối cụ thể
router.get('/connections/:key/check', databaseController.checkConnection);

// Lấy thông tin server của một kết nối
router.get('/connections/:key/server', databaseController.getServerInfo);

// Lấy thông tin database của một kết nối
router.get('/connections/:key/database', databaseController.getDatabaseInfo);

module.exports = router;