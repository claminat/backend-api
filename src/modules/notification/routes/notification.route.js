const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');

// All notification routes require authentication
router.use(authMiddleware.authenticate);

// User notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/mark-read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin only routes
router.use(authMiddleware.requireRole('admin'));
router.post('/send', notificationController.sendNotification);

module.exports = router;
