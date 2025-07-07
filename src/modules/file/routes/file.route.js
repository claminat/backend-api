const express = require('express');
const router = express.Router();
const FileController = require('../controllers/file.controller');

router.get('/', FileController.getFiles);


module.exports = router;
