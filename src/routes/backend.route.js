const express = require('express');
const router = express.Router();

// 🟢 IMPORT: Các route backend (API)
const authRoute = require('../modules/auth/routes/auth.route');
const mediaRoute = require('../modules/media/routes/media.route');
const fileRoute = require('../modules/file/routes/file.route');
const thirdPartyRoutes = require('../modules/thirdparty/routes/index');

// 🟢 REGISTER: Gắn các route API
router.use('/auth', authRoute);
router.use('/media', mediaRoute);
router.use('/file', fileRoute);
router.use('/thirdparty', thirdPartyRoutes);

module.exports = router;
