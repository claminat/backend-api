# 📦 Cấu Trúc Config Cho Dự Án Node.js Theo Môi Trường (`dev` / `prod`)

Việc tách biệt cấu hình giữa các môi trường `development` và `production` giúp dự án Node.js hoạt động ổn định, dễ mở rộng, và an toàn. Tài liệu này hướng dẫn cách tổ chức thư mục `config/` một cách rõ ràng, chuyên nghiệp và dễ sử dụng.

---

## 🗂️ Cấu Trúc Thư Mục

src/
├── shared/
│ └── config/
│ ├── index.js # Tự động chọn file theo NODE_ENV
│ ├── config.dev.js # Cấu hình riêng cho môi trường dev
│ ├── config.prod.js # Cấu hình riêng cho môi trường production
│ └── secrets.js # (tuỳ chọn) chứa các khóa bí mật, token, ...



---

## 🔐 File `.env` (đặt ở root)

```env
NODE_ENV=development
PORT=3000
MONGO_URI_DEV=mongodb://localhost:27017/devdb
MONGO_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/proddb
JWT_SECRET=super_secret
```


⚠️ Lưu ý:

- Không commit .env lên Git.
- Tạo file .env.example để chia sẻ cho team.

🧱 config.dev.js – Môi Trường Development

```javascript
module.exports = {
  env: 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI_DEV,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: 'debug',
};
```


🧱 config.prod.js – Môi Trường Production

```javascript
module.exports = {
  env: 'production',
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: 'warn',
};
```


🧠 index.js – Tự Động Load Config Theo NODE_ENV

```javascript

const env = process.env.NODE_ENV || 'development';

let config;
switch (env) {
  case 'production':
    config = require('./config.prod');
    break;
  case 'development':
  default:
    config = require('./config.dev');
    break;
}

module.exports = config;
```



🚀 Cách Sử Dụng Trong Dự Án

```javascript
// src/app.js hoặc src/server.js
const config = require('./shared/config');

console.log(`✅ Running in ${config.env} mode`);
mongoose.connect(config.mongoUri);
// ...
```



🧪 Cách Chạy Ứng Dụng
# Chạy ở môi trường dev (mặc định)
node server.js

# Chạy ở môi trường production
NODE_ENV=production node server.js


## Ưu Điểm

| Ưu điểm      | Giải thích                                      |
| ------------ | ----------------------------------------------- |
| ✅ Rõ ràng    | Dễ thấy cấu hình tương ứng với môi trường nào   |
| ✅ An toàn    | Không hard-code token, URI, thông tin nhạy cảm  |
| ✅ Dễ bảo trì | Có thể mở rộng config dễ dàng cho staging, test |
| ✅ Dễ test    | Có thể mock config riêng trong unit test        |

🛠 Bonus: Thư Viện Gợi Ý
- dotenv-flow: Hỗ trợ nhiều .env theo môi trường (.env.production, .env.test, ...)
- config: Quản lý config chuyên nghiệp theo thư mục config/
- rc: Config từ nhiều nguồn (file, env, cli)

📌 Ghi Nhớ
Cấu hình là phần cốt lõi để phân biệt các môi trường, vì vậy hãy:

- Giữ cho config/ rõ ràng, phân tầng.
- Tránh dùng process.env trực tiếp ở khắp nơi — luôn qua config.