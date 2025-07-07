# Auth Service

## Giới thiệu

Auth Service là một thành phần quan trọng trong hệ thống xác thực, chịu trách nhiệm xử lý tất cả logic nghiệp vụ liên quan đến việc đăng nhập, đăng ký, khôi phục mật khẩu và các chức năng xác thực khác.
## Giải thích về các phương thức trong auth.service.js

### login
- Xác thực thông tin đăng nhập (email và mật khẩu).
- Tạo và trả về token JWT nếu đăng nhập thành công.

### register

- Đăng ký người dùng mới sau khi kiểm tra tính hợp lệ của email và mật khẩu.
- Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu.

### resetPassword

- Đặt lại mật khẩu người dùng khi có token khôi phục hợp lệ.
- Cập nhật mật khẩu mới trong cơ sở dữ liệu sau khi mã hóa mật khẩu.

### verifyEmail

- Xác thực email thông qua mã token.
- Cập nhật trạng thái xác thực người dùng trong cơ sở dữ liệu.

### changePassword

- Cho phép người dùng đổi mật khẩu sau khi xác thực mật khẩu cũ.
- Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu.

## Lợi ích của cách triển khai này
- **Tách biệt logic nghiệp vụ**: Các chức năng liên quan đến xác thực người dùng được xử lý tập trung trong auth.service.js, giúp dễ dàng bảo trì và kiểm thử.

- **Đảm bảo bảo mật**: Mật khẩu được mã hóa trước khi lưu vào cơ sở dữ liệu và xác thực bằng cách sử dụng JWT.

- **Khả năng mở rộng**: Các phương thức có thể được mở rộng để thêm các chức năng mới như xác thực hai yếu tố (2FA) hoặc các phương thức đăng nhập khác (Google, Facebook, v.v.).

## Ví dụ về cách triển khai auth.service.js

```javascript
// modules/auth/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../../../config');

/**
 * Service xử lý đăng nhập người dùng
 * @param {string} email - Email của người dùng
 * @param {string} password - Mật khẩu chưa mã hóa
 * @returns {Object} - Thông tin người dùng và token JWT
 */
exports.login = async (email, password) => {
  // Tìm kiếm người dùng theo email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu không chính xác');
  }

  // Tạo JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token
  };
};

/**
 * Service xử lý đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Object} - Thông tin người dùng đã tạo
 */
exports.register = async (userData) => {
  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Tạo người dùng mới
  const user = new User({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  // Lưu vào database
  await user.save();

  // Tạo token xác thực
  const verificationToken = jwt.sign(
    { id: user._id },
    config.EMAIL_VERIFICATION_SECRET,
    { expiresIn: '24h' }
  );

  // Gửi email xác thực (giả định có một emailService)
  // await emailService.sendVerificationEmail(user.email, verificationToken);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

/**
 * Service đặt lại mật khẩu
 * @param {string} token - Token khôi phục mật khẩu
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} - Kết quả thao tác
 */
exports.resetPassword = async (token, newPassword) => {
  try {
    // Xác thực token
    const decoded = jwt.verify(token, config.PASSWORD_RESET_SECRET);

    // Tìm người dùng
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    return true;
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
};

/**
 * Service xác thực email
 * @param {string} token - Token xác thực email
 * @returns {boolean} - Kết quả thao tác
 */
exports.verifyEmail = async (token) => {
  try {
    // Xác thực token
    const decoded = jwt.verify(token, config.EMAIL_VERIFICATION_SECRET);

    // Tìm người dùng
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Cập nhật trạng thái xác thực
    user.isVerified = true;
    await user.save();

    return true;
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
};

/**
 * Service thay đổi mật khẩu
 * @param {string} userId - ID người dùng
 * @param {string} oldPassword - Mật khẩu cũ
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} - Kết quả thao tác
 */
exports.changePassword = async (userId, oldPassword, newPassword) => {
  // Tìm người dùng
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Kiểm tra mật khẩu cũ
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu cũ không chính xác');
  }

  // Mã hóa mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Cập nhật mật khẩu
  user.password = hashedPassword;
  await user.save();

  return true;
};
```

## Cách sử dụng Auth Service trong Controller

```javascript
// modules/auth/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { loginValidator, registerValidator } = require('../validators/auth.validator');

// Xử lý đăng nhập
exports.login = async (req, res) => {
  try {
    // Validate đầu vào
    const { error } = loginValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Gọi service xử lý đăng nhập
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xử lý đăng ký
exports.register = async (req, res) => {
  try {
    // Validate đầu vào
    const { error } = registerValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Gọi service xử lý đăng ký
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

## Tóm lại

Auth Service đóng vai trò trung tâm trong việc xử lý các logic nghiệp vụ liên quan đến xác thực và quản lý người dùng. Với cách triển khai có cấu trúc và tách biệt này, ứng dụng của bạn sẽ dễ dàng bảo trì, mở rộng và đảm bảo các tiêu chuẩn bảo mật cần thiết.
