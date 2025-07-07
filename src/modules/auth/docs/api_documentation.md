
# Tài liệu mô tả API - Module Auth

## 1. Mục tiêu
Tài liệu này mô tả các API liên quan đến module **Auth** (Đăng ký, Đăng nhập, Quên mật khẩu, Đặt lại mật khẩu, Xác thực email, và Xác thực hai yếu tố).

## 2. Các API chính

### 2.1 Đăng ký người dùng (User Registration)

- **Endpoint**: `/api/auth/register`
- **Phương thức**: `POST`
- **Mô tả**: Đăng ký người dùng mới.
- **Yêu cầu**: 
  - `email`: string, email người dùng.
  - `password`: string, mật khẩu người dùng (ít nhất 8 ký tự).
  - `name`: string, tên người dùng.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản."
  }
  ```
- **Lỗi**: 
  - 400 - Nếu email đã tồn tại.
  - 422 - Nếu dữ liệu đầu vào không hợp lệ.

### 2.2 Đăng nhập (Login)

- **Endpoint**: `/api/auth/login`
- **Phương thức**: `POST`
- **Mô tả**: Đăng nhập vào hệ thống.
- **Yêu cầu**: 
  - `email`: string, email người dùng.
  - `password`: string, mật khẩu người dùng.
- **Phản hồi thành công**: 
  ```json
  {
    "token": "JWT_TOKEN",
    "message": "Đăng nhập thành công."
  }
  ```
- **Lỗi**: 
  - 401 - Nếu thông tin đăng nhập không chính xác.
  - 400 - Nếu dữ liệu đầu vào không hợp lệ.

### 2.3 Quên mật khẩu (Forgot Password)

- **Endpoint**: `/api/auth/forgot-password`
- **Phương thức**: `POST`
- **Mô tả**: Gửi email khôi phục mật khẩu.
- **Yêu cầu**: 
  - `email`: string, email người dùng.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Mã khôi phục mật khẩu đã được gửi đến email của bạn."
  }
  ```
- **Lỗi**: 
  - 404 - Nếu email không tồn tại.

### 2.4 Đặt lại mật khẩu (Reset Password)

- **Endpoint**: `/api/auth/reset-password`
- **Phương thức**: `POST`
- **Mô tả**: Đặt lại mật khẩu mới.
- **Yêu cầu**: 
  - `resetToken`: string, mã khôi phục mật khẩu.
  - `newPassword`: string, mật khẩu mới.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Mật khẩu đã được thay đổi thành công."
  }
  ```
- **Lỗi**: 
  - 400 - Nếu token không hợp lệ hoặc đã hết hạn.

### 2.5 Xác thực email (Email Verification)

- **Endpoint**: `/api/auth/verify-email`
- **Phương thức**: `GET`
- **Mô tả**: Xác thực email người dùng.
- **Yêu cầu**: 
  - `token`: string, mã xác thực.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Email đã được xác thực thành công."
  }
  ```
- **Lỗi**: 
  - 400 - Nếu token không hợp lệ hoặc đã hết hạn.

### 2.6 Đổi mật khẩu (Change Password)

- **Endpoint**: `/api/auth/change-password`
- **Phương thức**: `PUT`
- **Mô tả**: Đổi mật khẩu cho người dùng đã đăng nhập.
- **Yêu cầu**: 
  - `oldPassword`: string, mật khẩu cũ.
  - `newPassword`: string, mật khẩu mới.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Mật khẩu đã được thay đổi thành công."
  }
  ```
- **Lỗi**: 
  - 401 - Nếu mật khẩu cũ không đúng.
  - 400 - Nếu mật khẩu mới không đủ mạnh.

### 2.7 Xác thực hai yếu tố (Two-Factor Authentication)

- **Endpoint**: `/api/auth/verify-2fa`
- **Phương thức**: `POST`
- **Mô tả**: Xác thực hai yếu tố cho người dùng.
- **Yêu cầu**: 
  - `otp`: string, mã OTP.
- **Phản hồi thành công**: 
  ```json
  {
    "message": "Xác thực 2FA thành công."
  }
  ```
- **Lỗi**: 
  - 400 - Nếu mã OTP không hợp lệ.
