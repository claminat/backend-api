const express = require('express');
const { moderateByUrl } = require('../controllers/sightengine.controller');
const { validateModerationInput } = require('../validators/sightengine.validator');

const router = express.Router();

router.post('/', validateModerationInput, moderateByUrl);

module.exports = router;
