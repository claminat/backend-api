const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../../../shared/middlewares/auth.middleware');

// All content routes require authentication
router.use(authMiddleware.authenticate);

// Content CRUD routes
router.get('/', contentController.getContents);
router.get('/:id', contentController.getContent);
router.post('/', contentController.createContent);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
