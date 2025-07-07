const express = require('express');
const router = express.Router();

// ✅ Import route từng module
router.use('/', require('../modules/dashboard/routes/dashboard.frontend.route'));  // Gắn /dashboard vào /
router.use('/auth', require('../modules/auth/routes/auth.frontend.route'));
router.use('/media', require('../modules/media/routes/media.frontend.route'));
router.use('/file', require('../modules/file/routes/file.frontend.route'));

module.exports = router;
