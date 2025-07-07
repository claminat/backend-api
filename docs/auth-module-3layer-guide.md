
# 🧱 Hướng Dẫn Triển Khai 1 Module Trong Kiến Trúc 3-Layer Module-Based (Clean & DDD-inspired)

Tài liệu này hướng dẫn cách triển khai một module (ví dụ: `auth`) từ đầu đến cuối theo kiến trúc 3-layer bao gồm:

- Presentation Layer
- Business Logic Layer
- Data Access Layer

---

## ✅ Cấu trúc thư mục chuẩn

```
src/
├── modules/
│   └── auth/
│       ├── controllers/          # Presentation Layer
│       │   └── auth.controller.js
│       ├── routes/               # Presentation Layer
│       │   └── auth.route.js
│       ├── services/             # Business Logic Layer
│       │   └── auth.service.js
│       ├── repositories/         # Data Access Layer
│       │   └── user.repository.js
│       ├── models/               # Database Model
│       │   └── user.model.js
│       └── validators/           # Validation rules (optional)
│           └── auth.validator.js
├── shared/
│   └── adapters/             # Data Access Adapter Layer
│       └── mongo.adapter.js
```

---

## 🔁 Flow từ client đến database

```yaml

Client → auth.route → auth.controller → auth.service → user.repository → MongoDB

```

---

## 📦 Các bước triển khai module `auth`

### 1. Khởi tạo `user.model.js` (Data Model)

```js
// modules/auth/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
```

---

### 2. Tạo `user.repository.js` (Data Access Layer)

```js
// modules/auth/repositories/user.repository.js
const User = require('../models/user.model');

exports.findByEmail = async (email) => User.findOne({ email });

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};
```

---

### 3. Tạo `auth.service.js` (Business Logic Layer)

```js
// modules/auth/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');
const config = require('../../../shared/config');

exports.login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });

  return { token, user: { id: user._id, email: user.email } };
};
```

---

### 4. Tạo `auth.controller.js` (Presentation Layer)

```js
// modules/auth/controllers/auth.controller.js
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
```

---

### 5. Định nghĩa route trong `auth.route.js`

```js
// modules/auth/routes/auth.route.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/login', controller.login);

module.exports = router;
```

6. Tạo mongo.adapter.js (Adapter Layer)
```js
// modules/auth/adapters/mongo.adapter.js
const BaseAdapter = require('../baseAdapter');
const mongoose = require('mongoose');

class MongoAdapter extends BaseAdapter {
  async connect() {
    this.connection = await mongoose.connect(this.config.uri);
    return this.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
    this.connection = null;
  }

  async isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = MongoAdapter;
```

7. Tạo baseAdapter.js (Base Adapter Layer)
```js

// modules/auth/baseAdapter.js
/**
 * BaseAdapter.js
 * Lớp cơ sở trừu tượng cho tất cả các adapter
 */

class BaseAdapter {
  /**
   * Khởi tạo adapter với các thông số cấu hình cần thiết
   * @param {Object} config - Cấu hình kết nối
   */
  constructor(config) {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter là lớp trừu tượng, không thể khởi tạo trực tiếp');
    }
    this.config = config;
    this.connection = null;
  }

  /**
   * Kết nối đến nguồn dữ liệu
   * @returns {Promise<any>} - Kết nối đến nguồn dữ liệu
   */
  async connect() {
    throw new Error('Phương thức connect() cần được triển khai bởi lớp con');
  }

  /**
   * Ngắt kết nối từ nguồn dữ liệu
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error('Phương thức disconnect() cần được triển khai bởi lớp con');
  }

  /**
   * Kiểm tra trạng thái kết nối
   * @returns {Promise<boolean>} - true nếu đã kết nối, false nếu chưa
   */
  async isConnected() {
    throw new Error('Phương thức isConnected() cần được triển khai bởi lớp con');
  }

  /**
   * Thực hiện một thao tác trên nguồn dữ liệu
   * @param {Function} operation - Hàm thực hiện thao tác
   * @returns {Promise<any>} - Kết quả của thao tác
   */
  async executeOperation(operation) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      return await operation(this.connection);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseAdapter;

```

---
8. Kết nối route và MongoDB trong `app.js`

```js
// app.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./shared/config');

const app = express();
app.use(express.json());

// MongoDB
mongoose.connect(config.mongo.uri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(console.error);

// Route modules
app.use('/api/auth', require('./modules/auth/routes/auth.route'));

module.exports = app;
```

---

9. 🚀 Khởi động server tại `server.js`

```js
// server.js
require('dotenv').config();
const app = require('./app');
const config = require('./shared/config');

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

10. 🔐 Cấu hình môi trường (`config.dev.js`)

```js
// shared/config/config.dev.js
module.exports = {
  port: 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
  },
  features: {
    enableDebugMode: true,
  },
  system: {``````````````````````````````         
    environment: 'development',
  },
};
```

---



---
## 🧪 Test API với Postman hoặc cURL

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}'
```

---

## ✅ Tóm tắt vai trò các file

| File / Layer           | Vai trò                    |
| ---------------------- | -------------------------- |
| `user.model.js`        | Mô hình dữ liệu MongoDB    |
| `user.repository.js`   | Truy cập và thao tác DB    |
| `auth.service.js`      | Xử lý logic đăng nhập      |
| `auth.controller.js`   | Nhận request, trả response |
| `auth.route.js`        | Mapping API route          |
| `config.dev.js`        | Config theo môi trường     |
| `app.js` / `server.js` | Bootstrap ứng dụng         |

---

## 🏁 Kết luận

- Module được triển khai theo luồng: **Route → Controller → Service → Repository → Model**
- 
- Module được triển khai theo luồng: **Model → Repository → Service → Controller → Route**
- 
- Dễ dàng kiểm thử, bảo trì, mở rộng.
- Tổ chức code rõ ràng, dễ onboard cho team mới.
