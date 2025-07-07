const express = require('express');
const router = express.Router();
const { validateRapidApi } = require('../validators/rapidapi.validator');
const { getTrendingPosts, searchScraper } = require('../controllers/rapidapi.controller');

router.get('/tiktok/trending', validateRapidApi, getTrendingPosts);
router.get('/tiktok/search', validateRapidApi, searchScraper);

module.exports = router;