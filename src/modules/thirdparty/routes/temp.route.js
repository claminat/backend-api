const express = require('express');
const multer = require('multer');
const { uploadToTempController } = require('../controllers/temp.controller');
const { validateUpload } = require('../validators/temp.validator');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), validateUpload, uploadToTempController);

module.exports = router;
