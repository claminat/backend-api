const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkNsfwFromUpload } = require('../controllers/nsfw.controller');

const upload = multer({ storage: multer.memoryStorage() }); // không lưu vào disk

router.post('/check', upload.single('file'), checkNsfwFromUpload);

module.exports = router;
