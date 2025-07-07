// modules/auth/routes/auth.route.js
const express = require('express');
const path = require('path'); 
const router = express.Router();
const { validate } = require('express-validation');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../../../shared/middlewares/auth.middleware'); // Import middleware xác thực
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require('../validators/auth.validator');

router.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, '../../auth/public/login.html'); // Xây dựng đường dẫn
    res.sendFile(loginPath); // Cung cấp tệp login.html
});


router.get('/home', (req, res) => {
    const homePath = path.join(__dirname, '../../auth/public/home.html'); // Xây dựng đường dẫn
    res.sendFile(homePath); // Cung cấp tệp login.html
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../auth/public/hello/index.html')); // Cung cấp tệp login.html
});

// Route đăng nhập
router.post('/login', authController.login);  // Đăng nhập qua API

// Route để đăng ký người dùng
router.post('/register', validate({ body: registerValidator }), authController.register);

// Route để đăng nhập
router.post('/login', validate({ body: loginValidator }), authController.login);

// Route để quên mật khẩu
router.post('/forgot-password', validate({ body: forgotPasswordValidator }), authController.forgotPassword);

// Route để reset mật khẩu
router.post('/reset-password', validate({ body: resetPasswordValidator }), authController.resetPassword);

// Route để thay đổi mật khẩu (Cần xác thực người dùng)
router.put('/change-password', authMiddleware.authenticate, validate({ body: changePasswordValidator }), authController.changePassword);

module.exports = router;
