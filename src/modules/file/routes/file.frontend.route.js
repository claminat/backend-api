const express = require('express');
const router = express.Router();
const FileFrontendController = require('../controllers/file.frontend.controller');

router.get('/list', FileFrontendController.getFiles);

module.exports = router;
