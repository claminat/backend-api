
# Tài liệu thiết kế hệ thống - Module Auth

## 1. Mục tiêu
Module **Auth** cung cấp các chức năng xác thực người dùng trong hệ thống, bao gồm các chức năng chính như: Đăng ký người dùng, Đăng nhập, Quên mật khẩu, Đặt lại mật khẩu, và xác thực 2 yếu tố (2FA).

## 2. Các chức năng chính của Module Auth

### 2.1 Đăng ký người dùng (User Registration)
- **Yêu cầu**: Người dùng cung cấp thông tin cơ bản (email, mật khẩu, tên) để tạo tài khoản.
- **Quy trình**:
  1. Kiểm tra tính hợp lệ của dữ liệu đầu vào.
  2. Kiểm tra xem email đã tồn tại hay chưa.
  3. Mã xác nhận gửi qua email cho người dùng để kích hoạt tài khoản.

### 2.2 Đăng nhập (Login)
- **Yêu cầu**: Người dùng đăng nhập vào hệ thống bằng email và mật khẩu.
- **Quy trình**:
  1. Xác thực email và mật khẩu.
  2. Tạo và trả về token JWT cho phép truy cập vào các tài nguyên bảo vệ.
  
### 2.3 Quên mật khẩu / Đặt lại mật khẩu (Forgot Password / Reset Password)
- **Yêu cầu**: Người dùng quên mật khẩu và cần khôi phục.
- **Quy trình**:
  1. Gửi email với liên kết khôi phục mật khẩu.
  2. Liên kết khôi phục chứa mã xác nhận để thay đổi mật khẩu.
  3. Cập nhật mật khẩu mới và lưu lại trong cơ sở dữ liệu.

### 2.4 Xác thực email (Email Verification)
- **Yêu cầu**: Sau khi đăng ký, người dùng cần xác thực email để kích hoạt tài khoản.
- **Quy trình**:
  1. Gửi mã xác thực qua email.
  2. Cập nhật trạng thái tài khoản khi email được xác nhận.

### 2.5 Cập nhật thông tin người dùng (Update Profile)
- **Yêu cầu**: Cho phép người dùng cập nhật các thông tin cá nhân như tên, email, v.v.
- **Quy trình**:
  1. Kiểm tra quyền truy cập và xác thực thông tin.
  2. Cập nhật thông tin vào cơ sở dữ liệu.

### 2.6 Đổi mật khẩu (Change Password)
- **Yêu cầu**: Người dùng có thể thay đổi mật khẩu khi đã đăng nhập.
- **Quy trình**:
  1. Kiểm tra mật khẩu cũ.
  2. Cập nhật mật khẩu mới (mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu).

### 2.7 Xác thực hai yếu tố (Two-Factor Authentication - 2FA)
- **Yêu cầu**: Bảo mật bổ sung khi người dùng đăng nhập.
- **Quy trình**:
  1. Sau khi đăng nhập, gửi mã OTP qua email hoặc SMS.
  2. Người dùng nhập mã OTP để xác thực.

### 2.8 Quản lý phiên (Session Management)
- **Yêu cầu**: Quản lý các phiên đăng nhập của người dùng.
- **Quy trình**:
  1. Tạo và duy trì session hoặc token JWT khi người dùng đăng nhập.
  2. Cung cấp cơ chế làm mới token khi token gần hết hạn.

## 3. Kiến trúc hệ thống
Module **Auth** sử dụng **JWT (JSON Web Tokens)** để thực hiện xác thực và duy trì phiên làm việc. Các yêu cầu liên quan đến xác thực người dùng sẽ được xử lý qua API Auth.

- **Công nghệ**: Node.js, Express.js, JWT
- **Cơ sở dữ liệu**: MongoDB
- **API**: RESTful API
