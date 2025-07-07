const express = require('express');
const multer = require('multer');
const { uploadToImgbbController } = require('../controllers/imgbb.controller');
const { validateUpload } = require('../validators/imgbb.validator');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/', upload.single('file'), validateUpload, uploadToImgbbController);

module.exports = router;
