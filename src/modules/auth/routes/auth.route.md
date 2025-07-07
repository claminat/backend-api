# Giải Thích Các Phần Trong `auth.route.js`

## 1. Định Nghĩa Các Route API
- **POST `/register`**: Để đăng ký người dùng mới. Sử dụng `registerValidator` để kiểm tra tính hợp lệ của dữ liệu người dùng.
- **POST `/login`**: Để người dùng đăng nhập. Sử dụng `loginValidator` để kiểm tra tính hợp lệ của email và mật khẩu.
- **POST `/forgot-password`**: Để người dùng yêu cầu khôi phục mật khẩu. Sử dụng `forgotPasswordValidator` để kiểm tra tính hợp lệ của email.
- **POST `/reset-password`**: Để người dùng thay đổi mật khẩu sau khi nhận được mã khôi phục. Sử dụng `changePasswordValidator` để kiểm tra tính hợp lệ của mật khẩu mới.
- **GET `/verify-email`**: Để xác thực email người dùng. Sử dụng `forgotPasswordValidator` để kiểm tra token xác thực.
- **PUT `/change-password`**: Để người dùng thay đổi mật khẩu khi đã đăng nhập. Sử dụng `changePasswordValidator` để kiểm tra tính hợp lệ của mật khẩu cũ và mới.

## 2. Sử Dụng `express-validation`
- **express-validation** là thư viện giúp kiểm tra tính hợp lệ của dữ liệu yêu cầu (request data).
- Dữ liệu được kiểm tra thông qua các **validator** được định nghĩa trong `auth.validator.js`. Mỗi route sử dụng validator riêng biệt để đảm bảo rằng các yêu cầu từ client có tính hợp lệ trước khi xử lý logic nghiệp vụ.
- **Lợi ích**: Việc kiểm tra dữ liệu đầu vào giúp ngăn ngừa các lỗi từ phía client và đảm bảo rằng dữ liệu gửi lên luôn đúng định dạng.

## 3. Gọi Controller
- Mỗi route API sẽ gọi phương thức tương ứng trong **controller** (`auth.controller.js`) để thực thi logic nghiệp vụ.
- **Controller** là nơi xử lý các request và response từ phía client. Nó gọi các phương thức trong service để thực hiện logic như đăng ký, đăng nhập, thay đổi mật khẩu, v.v.

## 4. Sử Dụng `express.Router()`
- **express.Router()** cho phép bạn chia tách các routes thành các phần riêng biệt, giúp mã nguồn dễ quản lý hơn.
- Mỗi route sẽ được cấu hình với một **HTTP method** (POST, GET, PUT) và một **endpoint** (ví dụ: `/login`).

## 5. Lợi Ích Của Việc Sử Dụng Routes Này
- **Tổ chức rõ ràng**: Các route API được tổ chức một cách rõ ràng và dễ hiểu, giúp cho việc quản lý và mở rộng API trở nên dễ dàng.
- **Kết nối controller và middleware**: Routes kết nối trực tiếp với controller để xử lý các yêu cầu từ client và trả về kết quả.
- **Dễ dàng kiểm thử**: Với việc chia thành các route và controller riêng biệt, bạn có thể kiểm thử từng phần của hệ thống một cách độc lập.

## 6. Tóm Tắt
Tệp `auth.route.js` đóng vai trò quan trọng trong việc định nghĩa các API endpoint cho module **Auth**, đồng thời thực hiện việc **validate** dữ liệu đầu vào và gọi các phương thức xử lý từ controller.
