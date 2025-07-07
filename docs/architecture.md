# Backend API - Technical Requirements

## 1. System Architecture

### 1.1 Kiến trúc 3-Layer Module-Based (Clean & DDD-inspired) Architecture Overview

        Request
           ↓
┌────────────────────┐
│  Presentation Layer│
│────────────────────│
│ - Routes           │
│ - Controllers      │
│ - Request DTOs     │
└────────┬───────────┘
         ↓
┌────────────────────┐
│ Business Logic Layer│
│────────────────────│
│ - Services          │
│ - Use Cases (Logic) │
│ - Validators        │
│ - Domain Models     │
└────────┬───────────┘
         ↓
┌────────────────────┐
│   Data Access Layer│
│────────────────────│
│ - Repositories      │
│ - Adapters          │
│ - Persistence Models│
└────────────────────┘
         ↓
       Database

🛠 Cross-Cutting (shared/):
- Middlewares (Auth, Logger, Error)
- Utils (Formatters, Mappers)
- Config, Constants


#### Trách nhiệm từng tầng:

- **Presentation Layer**: Xử lý tương tác với người dùng, nhận và trả về dữ liệu
- **Business Logic Layer**: Xử lý các quy tắc nghiệp vụ của ứng dụng
- **Data Access Layer**: Quản lý việc lưu trữ và truy xuất dữ liệu



## 1.2 Cấu trúc thư mục chi tiết dự án

Dự án được tổ chức theo cấu trúc thư mục sau:

```
src/
├── modules/
│   ├── admin/
│   │   ├── controllers/
│   │   │   └── database.controller.js
│   │   ├── models/
│   │   │   └── settings.model.js
│   │   └── routes/
│   │       └── database.route.js
│   ├── auth/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── models/
│   │   │   └── user.model.js
│   │   ├── repositories/
│   │   │   └── user.repository.js # Kế thừa từ BaseRepository
│   │   ├── routes/
│   │   │   └── auth.route.js
│   │   ├── services/
│   │   │   └── auth.service.js
│   │   └── validators/
│   │       └── auth.validator.js
│   ├── content/
│   │   ├── controllers/
│   │   │   └── content.controller.js
│   │   ├── models/
│   │   │   └── content.model.js
│   │   ├── repositories/
│   │   │   └── content.repository.js # Kế thừa từ BaseRepository
│   │   ├── routes/
│   │   │   └── content.route.js
│   │   ├── services/
│   │   │   └── content.service.js
│   │   └── validators/
│   │       └── content.validator.js
│   └── notification/
│       ├── controllers/
│       │   └── notification.controller.js
│       ├── routes/
│       │   └── notification.route.js
│       └── services/
│           └── notification.service.js
├── shared/
│   ├── repositories/
│   │   ├── MongoRepository.js        # MongoRepository
│   │   ├── GoogleSheetsRepository.js  # GoogleSheetsRepository
│   │   └── MySQLRepository.js       # MySQLRepository
│   ├── adapters/
│   │   ├── database/
│   │   │   ├── mongo.adapter.js # Adapter cho MongoDB
│   │   │   ├── googleSheets.adapter.js # Adapter cho Google Sheets
│   │   │   └── mysql.adapter.js # Adapter cho MySQL
│   │   ├── external/
│   │   │   └── apiService.js
│   │   ├── storage/
│   │   │   └── storageService.js
│   │   └── baseAdapter.js # Adapter cơ sở, sử dụng chung
│   ├── config/
│   │   ├── config.dev.js
│   │   ├── config.prod.js
│   │   └── index.js
│   ├── constants/
│   ├── helpers/
│   │   ├── errorHelper.js
│   │   ├── tokenHelper.js
│   │   └── whitelistHelper.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   └── services/
│       └── userService.js
└── app.js
```

### 1.3 Cấu trúc thư mục và phân chia trách nhiệm

## Giải thích chi tiết về các thành phần trong module dự án được tổ chức theo kiến trúc module-based (Domain-Driven, 3-layer) với cấu trúc thư mục như sau:

| **Thành phần**   | **Vị trí**                     | **Giải thích**                                                                    | **Ví dụ thư mục/tệp**                              |
| ---------------- | ------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Routes**       | Presentation Layer             | Mapping endpoint → controller                                                     | `src/modules/auth/routes/auth.route.js`            |
| **Controllers**  | Presentation Layer             | Nhận HTTP request, gọi service                                                    | `src/modules/auth/controllers/auth.controller.js`  |
| **DTOs**         | Presentation Layer             | Biểu diễn input/output định dạng JSON                                             | (chưa có trong dự án hiện tại)                     |
| **Services**     | Business Layer                 | Logic nghiệp vụ chính                                                             | `src/modules/auth/services/auth.service.js`        |
| **Validators**   | Business Layer                 | Kiểm tra logic input (validation, rules)                                          | `src/modules/auth/validators/auth.validator.js`    |
| **Repositories** | Data Layer                     | Giao tiếp DB (CRUD)                                                               | `src/modules/auth/repositories/user.repository.js` |
| **Adapters**     | Data Layer hoặc Infrastructure | Tương tác hệ thống ngoài như file, Redis, email                                   | `src/shared/adapters/database/mongo.adapter.js`    |
| **Middlewares**  | Cross-layer (shared)           | Auth, Logger, Error handler, v.v.                                                 | `src/shared/middlewares/auth.middleware.js`        |
| **Models**       | Data Layer                     | Định nghĩa mô hình dữ liệu, cấu trúc dữ liệu trong ứng dụng                       | `src/modules/auth/models/user.model.js`            |
| **Shared**       | Cross-layer (shared)           | Chứa các thành phần dùng chung như adapter, middleware, cấu hình, helper, hằng số | `src/shared/adapters/`, `src/shared/middlewares/`  |
| **App.js**       | Root                           | Điểm khởi đầu của ứng dụng, đăng ký các route và middleware                       | `src/app.js`                                       |

## Giải thích chi tiết:

1. **Routes**: 
   - Định nghĩa các endpoint API và ánh xạ chúng đến các controller.
   - Ví dụ: **`auth.route.js`** sẽ có các route cho việc đăng ký, đăng nhập, reset mật khẩu, v.v.

2. **Controllers**:
   - Xử lý các yêu cầu HTTP và trả về phản hồi.
   - Ví dụ: **`auth.controller.js`** sẽ nhận các yêu cầu từ người dùng, gọi các dịch vụ xử lý logic và trả về kết quả.

3. **DTOs (Data Transfer Objects)**:
   - Biểu diễn cấu trúc dữ liệu đầu vào và đầu ra của API. (Hiện tại không có trong dự án nhưng có thể thêm vào khi cần chuyển đổi dữ liệu giữa các tầng.)

4. **Services**:
   - Chứa logic nghiệp vụ của ứng dụng. Các controller sẽ gọi các phương thức trong service để thực thi nghiệp vụ.
   - Ví dụ: **`auth.service.js`** sẽ xử lý logic như xác thực người dùng, tạo JWT token, xử lý reset mật khẩu.

5. **Validators**:
   - Kiểm tra tính hợp lệ của dữ liệu đầu vào trước khi gửi đến service hoặc database.
   - Ví dụ: **`auth.validator.js`** sẽ kiểm tra tính hợp lệ của email, mật khẩu, v.v.

6. **Repositories**:
   - Chứa các phương thức tương tác với cơ sở dữ liệu (CRUD).
   - Ví dụ: **`user.repository.js`** sẽ chứa các phương thức để tìm kiếm, tạo, cập nhật người dùng trong cơ sở dữ liệu.

7. **Adapters**:
   - Chịu trách nhiệm kết nối với các hệ thống bên ngoài như cơ sở dữ liệu, email, Redis, v.v.
   - Ví dụ: **`mongo.adapter.js`** sẽ giúp kết nối và thực hiện các thao tác CRUD với MongoDB.

8. **Middlewares**:
   - Được sử dụng để xử lý các yêu cầu trước khi đến controller (như kiểm tra token, bảo mật, log, v.v.).
   - Ví dụ: **`auth.middleware.js`** sẽ kiểm tra xem người dùng có token hợp lệ trước khi cho phép truy cập vào các route cần xác thực.

9. **Models**:
   - Định nghĩa cấu trúc dữ liệu trong hệ thống. Mỗi model đại diện cho một bảng hoặc collection trong cơ sở dữ liệu.
   - Ví dụ: **`user.model.js`** sẽ định nghĩa cấu trúc dữ liệu người dùng trong MongoDB.

10. **Shared**:
    - Chứa các thành phần dùng chung, giúp tái sử dụng trong toàn bộ dự án (như middleware, adapter, cấu hình, helper, hằng số).
    - Ví dụ: Thư mục **`shared/adapters/`** chứa các adapter như **`mongo.adapter.js`**, **`shared/middlewares/`** chứa các middleware như **`auth.middleware.js`**.

11. **App.js**:
    - Đây là điểm khởi đầu của ứng dụng, nơi các route và middleware sẽ được đăng ký vào ứng dụng.

## Tổng kết:
- Mỗi module sẽ bao gồm các thành phần chính như **Controllers**, **Services**, **Validators**, **Repositories**, và **Models**.
- **Routes** và **Controllers** nằm trong **Presentation Layer**, còn **Services**, **Validators**, **Repositories**, và **Models** nằm trong **Business Layer** và **Data Layer**.
- Các thành phần dùng chung như **Adapters**, **Middlewares**, **Helpers** và **Constants** sẽ được đặt trong thư mục **shared** để tái sử dụng.
- Tệp **app.js** là điểm khởi đầu của ứng dụng, đăng ký các route và middleware.

Với cấu trúc này, bạn có thể dễ dàng mở rộng và bảo trì ứng dụng khi thêm các module mới hoặc cải tiến các tính năng hiện tại.

