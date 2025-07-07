const express = require('express');
const router = express.Router();
const authFrontendController = require('../controllers/auth.frontend.controller');

// Giao diện đăng nhập
router.get('/signin', authFrontendController.getSigninPage);

// Giao diện đăng ký
router.get('/signup', authFrontendController.getSignupPage);

module.exports = router;
