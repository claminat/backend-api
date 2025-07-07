const express = require('express');
const router = express.Router();

router.use('/imgbb', require('./imgbb.route'));
router.use('/sightengine', require('./sightengine.route'));
router.use('/temp', require('./temp.route'));
router.use('/nsfw', require('./nsfw.route'));
router.use('/rapidapi', require('./rapidapi.route'));


module.exports = router;
