const express = require('express');
const router = express.Router();
const mediaFrontendController = require('../controllers/media.frontend.controller');

// ✅ Định tuyến
router.get('/list', mediaFrontendController.list);
router.get('/duplicate', mediaFrontendController.duplicate);

module.exports = router;
