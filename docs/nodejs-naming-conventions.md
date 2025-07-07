
# Quy Ước Đặt Tên Cho Node.js Project

Tài liệu này mô tả các quy ước đặt tên trong một dự án Node.js, bao gồm cách đặt tên cho các thành phần như **Classes**, **Tệp**, **Biến**, **Function Names**, và nhiều yếu tố khác trong dự án.

---

## 1. Classes và Constructors
- **Quy tắc**: Viết **CamelCase**, bắt đầu bằng **chữ cái in hoa**.
- **Ví dụ**:
  - `MongoRepository`
  - `UserController`
  - `AuthService`
- **Giải thích**: Các lớp (class) là những đối tượng trừu tượng trong hệ thống, vì vậy phải sử dụng cách viết này để dễ dàng phân biệt với các biến thông thường.

---

## 2. Tên tệp (File Names)
- **Quy tắc**: Sử dụng **lowercase** với **dấu gạch nối** (`-`) hoặc **dấu chấm** (`.`) để phân tách các từ.
- **Ví dụ**:
  - `user.controller.js`
  - `auth.service.js`
  - `mongo.adapter.js`
  - `user.repository.js`
- **Giải thích**: Tên tệp nên rõ ràng, mô tả đúng chức năng hoặc module mà nó đảm nhận, giúp dễ dàng tìm kiếm và duy trì.

---

## 3. Biến (Variables)
- **Quy tắc**: Viết **camelCase** cho biến thông thường.
- **Ví dụ**:
  - `userData`
  - `emailList`
  - `authToken`
- **Giải thích**: **camelCase** là chuẩn phổ biến trong JavaScript, giúp phân biệt biến thông thường với các tên lớp hoặc constructors.

---

## 4. Biến toàn cục (Global Variables)
- **Quy tắc**: Tránh sử dụng biến toàn cục, nếu cần, có thể sử dụng **`global`** hoặc **`process.env`** cho các cấu hình toàn cục.
- **Ví dụ**:
  - `global.dbConnection` (Nên hạn chế, nếu có thể)
  - `process.env.MONGO_URI`
- **Giải thích**: Tránh việc lạm dụng biến toàn cục để tránh rủi ro gây xung đột trong hệ thống.

---

## 5. Hằng số (Constants)
- **Quy tắc**: Sử dụng **UPPERCASE** và **dấu gạch dưới** (`_`) để phân tách các từ.
- **Ví dụ**:
  - `JWT_SECRET`
  - `MONGO_URI`
  - `API_URL`
- **Giải thích**: Các hằng số là những giá trị không thay đổi trong suốt vòng đời ứng dụng, và việc viết hoa tất cả các ký tự giúp dễ dàng nhận biết và không nhầm lẫn với các biến thông thường.

---

## 6. Function Names
- **Quy tắc**: Viết **camelCase**, bắt đầu bằng **chữ cái in thường**.
- **Ví dụ**:
  - `getUserData()`
  - `createNewUser()`
  - `sendEmailNotification()`
- **Giải thích**: Hàm là những khối mã thực thi chức năng, vì vậy cần rõ ràng và mô tả đúng chức năng.

---

## 7. Middleware Names
- **Quy tắc**: Viết **camelCase** cho tên middleware.
- **Ví dụ**:
  - `authMiddleware`
  - `errorHandlerMiddleware`
  - `loggerMiddleware`
- **Giải thích**: Middleware là các hàm xử lý giữa các request và response trong ứng dụng Node.js. Việc sử dụng **camelCase** giúp phân biệt chúng với các tên tệp và hàm khác.

---

## 8. Event Names
- **Quy tắc**: Viết **lowercase**, có thể sử dụng **dấu gạch nối** hoặc **dấu chấm** để phân tách các từ.
- **Ví dụ**:
  - `user.created`
  - `order.updated`
  - `data.fetched`
- **Giải thích**: Event names thường theo quy ước này để dễ dàng theo dõi và thông báo khi các sự kiện quan trọng xảy ra trong hệ thống.

---

## 9. Error Handling (Tên lỗi)
- **Quy tắc**: Viết **PascalCase** cho các lớp lỗi và **camelCase** cho các đối tượng lỗi.
- **Ví dụ**:
  - `DatabaseError`
  - `InvalidInputError`
  - `UnauthorizedAccessError`
- **Giải thích**: Để dễ dàng phân biệt các lớp lỗi với các lớp và đối tượng khác trong hệ thống.

---

## 10. Module Names
- **Quy tắc**: Viết **lowercase** với **dấu gạch nối** nếu tên module có nhiều từ.
- **Ví dụ**:
  - `auth`
  - `user-management`
  - `notification-service`
- **Giải thích**: Các module là các phần độc lập trong ứng dụng, giúp dễ dàng tái sử dụng, kiểm thử và mở rộng.

---

## 11. Test File Names
- **Quy tắc**: Tên các tệp kiểm thử nên theo định dạng tên module + `.test.js` hoặc `spec`.
- **Ví dụ**:
  - `auth.service.test.js`
  - `user.repository.spec.js`
  - `mongo.adapter.test.js`
- **Giải thích**: Cấu trúc này giúp dễ dàng tìm kiếm và tổ chức các tệp kiểm thử trong dự án, đồng thời dễ dàng xác định tệp kiểm thử tương ứng với các module.

---

## 12. Tài liệu (Documentation)
- **Quy tắc**: Tên tệp tài liệu nên sử dụng **lowercase** với dấu gạch nối giữa các từ.
- **Ví dụ**:
  - `api-documentation.md`
  - `system-design-documentation.md`
  - `readme.md`
- **Giải thích**: Tên tệp tài liệu giúp người khác dễ dàng nhận diện và tìm kiếm tài liệu trong hệ thống.

---

### Tóm tắt quy tắc đặt tên:

| Thành phần                  | Quy tắc                                   | Ví dụ                           |
| --------------------------- | ---------------------------------------- | ------------------------------- |
| **Classes/Constructors**     | PascalCase (Viết hoa chữ cái đầu mỗi từ) | `MongoRepository`, `UserController` |
| **Tệp**                     | lowercase, dấu gạch nối                 | `auth.controller.js`, `user.model.js` |
| **Biến**                    | camelCase                                | `userData`, `authToken`         |
| **Biến toàn cục**            | Tránh sử dụng, sử dụng `global` hoặc `process.env` | `global.dbConnection`, `process.env.PORT` |
| **Hằng số**                  | UPPERCASE, dấu gạch dưới                | `JWT_SECRET`, `MONGO_URI`       |
| **Function Names**           | camelCase                                | `getUserData()`, `createUser()` |
| **Middleware Names**         | camelCase                                | `authMiddleware`, `loggerMiddleware` |
| **Event Names**              | lowercase, dấu gạch nối hoặc dấu chấm   | `user.created`, `order.updated` |
| **Error Handling**           | PascalCase cho lỗi lớp, camelCase cho đối tượng lỗi | `DatabaseError`, `InvalidInputError` |
| **Module Names**             | lowercase, dấu gạch nối                 | `auth`, `user-management`       |
| **Test File Names**          | Module name + `.test.js` hoặc `.spec.js` | `auth.service.test.js`          |
| **Tài liệu**                 | lowercase, dấu gạch nối                 | `api-documentation.md`          |

---

### Lưu ý quan trọng:
- **Consistency**: Đảm bảo tuân thủ quy tắc này nhất quán trong toàn bộ dự án.
- **Clear Naming**: Tên phải rõ ràng và mô tả đúng chức năng của thành phần.
- **Scalability**: Quy tắc đặt tên giúp hệ thống dễ mở rộng và bảo trì trong tương lai.
