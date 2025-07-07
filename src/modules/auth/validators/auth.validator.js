// modules/auth/validators/auth.validator.js
const Joi = require('joi');

// Validator cho đăng ký người dùng
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

// Validator cho đăng nhập
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

// Validator cho quên mật khẩu
const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
});

// Validator cho reset mật khẩu
const resetPasswordValidator = Joi.object({
  resetToken: Joi.string().required().messages({
    'string.empty': 'Mã khôi phục không được để trống',
    'any.required': 'Mã khôi phục là bắt buộc',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'Mật khẩu mới không được để trống',
    'string.min': 'Mật khẩu mới phải có ít nhất 8 ký tự',
    'any.required': 'Mật khẩu mới là bắt buộc',
  }),
});

// Validator cho thay đổi mật khẩu
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
  resetPasswordValidator,
  changePasswordValidator,
};
