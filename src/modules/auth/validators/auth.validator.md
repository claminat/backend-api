# Auth Validator

## Giới thiệu

Tệp auth.validator.js là một phần rất quan trọng trong module Auth, đặc biệt khi bạn muốn thực hiện kiểm tra tính hợp lệ (validation) cho các dữ liệu đầu vào trong quá trình xử lý đăng ký, đăng nhập, và các hành động khác liên quan đến xác thực người dùng.
## Mục đích của auth.validator.js

- **Kiểm tra dữ liệu đầu vào**: Đảm bảo rằng dữ liệu người dùng gửi lên (ví dụ: email, mật khẩu) tuân thủ các quy tắc xác định trước, như định dạng hợp lệ, độ dài tối thiểu, v.v.

- **Giảm thiểu lỗi và bảo mật**: Kiểm tra tính hợp lệ của dữ liệu giúp giảm thiểu khả năng các lỗi do dữ liệu không hợp lệ và có thể ngăn ngừa các cuộc tấn công như SQL Injection hoặc XSS.

- **Tăng tính dễ bảo trì**: Tách biệt phần logic kiểm tra đầu vào ra khỏi các phần khác của ứng dụng, giúp mã nguồn dễ bảo trì hơn.

## Lợi ích của việc sử dụng auth.validator.js

- **Giảm thiểu lỗi do đầu vào không hợp lệ**: Validation giúp đảm bảo rằng dữ liệu người dùng gửi lên là hợp lệ, giúp tránh các lỗi xảy ra khi dữ liệu không hợp lệ.

- **Bảo mật**: Kiểm tra mật khẩu, email giúp ngăn ngừa các cuộc tấn công như SQL Injection, XSS, hoặc các lỗi bảo mật khác.

- **Quản lý dễ dàng**: Việc tách riêng logic kiểm tra đầu vào giúp mã nguồn dễ bảo trì và kiểm thử.

## Khi nào cần sử dụng auth.validator.js?

- **Đăng ký người dùng**: Kiểm tra tính hợp lệ của email, mật khẩu (độ dài tối thiểu, ký tự đặc biệt, v.v.).

- **Đăng nhập**: Kiểm tra rằng email và mật khẩu có đúng định dạng không.

- **Quên mật khẩu**: Kiểm tra tính hợp lệ của email để gửi mã khôi phục.

- **Xác thực mật khẩu**: Kiểm tra tính hợp lệ của mật khẩu mới khi người dùng yêu cầu thay đổi mật khẩu.

- Khi người dùng gửi dữ liệu đầu vào (email, mật khẩu): Validation giúp đảm bảo tính hợp lệ của email, mật khẩu, và các trường khác.

- Khi xử lý các yêu cầu đăng ký, đăng nhập, quên mật khẩu, thay đổi mật khẩu: Kiểm tra dữ liệu người dùng trước khi thực hiện các thao tác.

## Ví dụ về cách triển khai auth.validator.js

Bạn có thể sử dụng thư viện Joi hoặc express-validator để thực hiện validation cho các yêu cầu. Dưới đây là một ví dụ sử dụng Joi để kiểm tra dữ liệu đầu vào.

### auth.validator.js (sử dụng Joi)

```javascript
// modules/auth/validators/auth.validator.js
const Joi = require('joi');

/**
 * Validator cho đăng ký người dùng
 */
const registerValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là bắt buộc',
  }),
});

/**
 * Validator cho đăng nhập
 */
const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc',
  }),
});

/**
 * Validator cho quên mật khẩu
 */
const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
});

/**
 * Validator cho thay đổi mật khẩu
 */
const changePasswordValidator = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Mật khẩu cũ không được để trống',
    'any.required': 'Mật khẩu cũ là bắt buộc',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'Mật khẩu mới không được để trống',
    'string.min': 'Mật khẩu mới phải có ít nhất 8 ký tự',
    'any.required': 'Mật khẩu mới là bắt buộc',
  }),
});

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  changePasswordValidator,
};
```

### Cách sử dụng Validator trong Controller

Sau khi tạo xong validator, bạn có thể sử dụng chúng trong controller để kiểm tra dữ liệu đầu vào trước khi tiếp tục với các thao tác xử lý:

```javascript
// modules/auth/controllers/auth.controller.js
const authService = require('../services/auth.service');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  changePasswordValidator
} = require('../validators/auth.validator');

// Đăng ký người dùng
exports.register = async (req, res) => {
  const { error } = registerValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { error } = loginValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

## Tóm lại

auth.validator.js là rất hữu ích trong việc đảm bảo rằng dữ liệu đầu vào từ người dùng luôn hợp lệ và bảo mật, giúp giảm thiểu lỗi và bảo vệ hệ thống của bạn. Bằng cách tách riêng logic validation, bạn cũng làm cho code của mình dễ đọc, dễ bảo trì và dễ mở rộng hơn.
