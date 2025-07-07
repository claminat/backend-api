# Giải Thích Các Phương Thức Trong `auth.controller.js`

## 1. Đăng Ký Người Dùng (register)
- **Mô tả**: Phương thức này sẽ xử lý yêu cầu đăng ký người dùng mới. Dữ liệu được gửi từ phía client sẽ được **validate** bằng **validator** trước khi được chuyển qua **service** để đăng ký.
- **Quy trình**:
  1. Validate dữ liệu đầu vào (email, mật khẩu, tên).
  2. Gọi **authService.register()** để tạo người dùng mới.
  3. Nếu đăng ký thành công, trả về thông tin người dùng mới.
  4. Nếu có lỗi (ví dụ email đã tồn tại), trả về thông báo lỗi.
  
## 2. Đăng Nhập (login)
- **Mô tả**: Phương thức này sẽ xử lý yêu cầu đăng nhập. Sau khi **validate** dữ liệu đầu vào (email và mật khẩu), nó sẽ gọi **authService.login()** để thực hiện kiểm tra thông tin người dùng và trả về một token JWT nếu đăng nhập thành công.
- **Quy trình**:
  1. Validate dữ liệu đầu vào (email và mật khẩu).
  2. Gọi **authService.login()** để kiểm tra thông tin đăng nhập.
  3. Trả về token JWT và thông tin người dùng nếu đăng nhập thành công.
  4. Nếu thông tin không hợp lệ, trả về thông báo lỗi.

## 3. Quên Mật Khẩu (forgotPassword)
- **Mô tả**: Khi người dùng quên mật khẩu, họ sẽ yêu cầu gửi mã khôi phục mật khẩu qua email. Phương thức này sẽ **validate** email và gọi **authService.forgotPassword()** để gửi email khôi phục.
- **Quy trình**:
  1. Validate email người dùng.
  2. Gọi **authService.forgotPassword()** để gửi mã khôi phục mật khẩu.
  3. Trả về kết quả gửi mã (hoặc thông báo lỗi nếu không tìm thấy email).

## 4. Đặt Lại Mật Khẩu (resetPassword)
- **Mô tả**: Người dùng có thể đặt lại mật khẩu của mình thông qua token khôi phục. Phương thức này sẽ **validate** token và mật khẩu mới trước khi gọi **authService.resetPassword()** để thay đổi mật khẩu.
- **Quy trình**:
  1. Validate token khôi phục và mật khẩu mới.
  2. Gọi **authService.resetPassword()** để cập nhật mật khẩu mới.
  3. Trả về thông báo thành công nếu mật khẩu được thay đổi thành công.

## 5. Xác Thực Email (verifyEmail)
- **Mô tả**: Sau khi đăng ký, người dùng cần phải xác thực email của mình. Phương thức này xử lý việc xác thực email qua token và cập nhật trạng thái `isVerified` trong cơ sở dữ liệu.
- **Quy trình**:
  1. Validate token xác thực email.
  2. Gọi **authService.verifyEmail()** để xác thực email người dùng.
  3. Trả về thông báo thành công nếu email được xác thực thành công.

## 6. Đổi Mật Khẩu (changePassword)
- **Mô tả**: Người dùng có thể thay đổi mật khẩu của mình sau khi đăng nhập. Phương thức này sẽ **validate** mật khẩu cũ và mới, sau đó gọi **authService.changePassword()** để cập nhật mật khẩu mới trong cơ sở dữ liệu.
- **Quy trình**:
  1. Validate mật khẩu cũ và mới.
  2. Gọi **authService.changePassword()** để cập nhật mật khẩu mới.
  3. Trả về thông báo thành công nếu mật khẩu được thay đổi thành công.