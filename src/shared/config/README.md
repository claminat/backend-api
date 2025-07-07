# Cấu hình Chrome Extension

## Cấu trúc thư mục

```
config/
├── index.js          # Entry point, tự động chọn config phù hợp
├── config.dev.js     # Cấu hình cho môi trường development
├── config.prod.js    # Cấu hình cho môi trường production
└── README.md         # Tài liệu hướng dẫn
```

## Cách sử dụng

### 1. Import config

```javascript
import config, { apiUrls } from '../config';

// Sử dụng config
const authStorageKey = config.storage.auth;
const verifyUrl = apiUrls.verifyGoogle;
```

### 2. Chọn môi trường

Config sẽ tự động chọn dựa trên:
- `process.env.NODE_ENV === 'development'`
- Hoặc version trong manifest.json chứa 'dev'

### 3. Cấu trúc config

```javascript
{
  api: {
    baseUrl: string,
    endpoints: {
      verifyGoogle: string,
      refreshToken: string
    }
  },

  auth: {
    tokenExpiryTime: number,
    refreshBeforeExpiry: number
  },

  storage: {
    auth: string,
    settings: string
  },

  badge: {
    success: string,
    error: string,
    warning: string
  },

  features: {
    enableAutoRefresh: boolean,
    enableOfflineMode: boolean,
    enableDebugMode: boolean
  }
}
```

### 4. API URLs

`apiUrls` object chứa full URL cho mỗi endpoint:
```javascript
{
  verifyGoogle: 'https://api.example.com/webhook/verify-google',
  refreshToken: 'https://api.example.com/auth/refresh-token'
}
```

## Development vs Production

### Development (config.dev.js)
- Local server: `http://localhost:3000`
- Debug mode enabled
- Development storage keys
- Offline mode enabled

### Production (config.prod.js)
- Production server: `https://n8n.vovavovan.xyz`
- Debug mode disabled
- Production storage keys
- Offline mode disabled

## Debug Mode

Khi `enableDebugMode = true`:
- Log config khi extension khởi động
- Log chi tiết API calls
- Log authentication flow

## Thêm cấu hình mới

1. Thêm vào cả `config.dev.js` và `config.prod.js`
2. Giữ cấu trúc nhất quán
3. Cập nhật README.md
4. Test trên cả hai môi trường

## Best Practices

1. **Không hard-code URLs**
   ```javascript
   // ❌ Bad
   fetch('https://api.example.com/endpoint')
   
   // ✅ Good
   fetch(apiUrls.endpoint)
   ```

2. **Sử dụng storage keys**
   ```javascript
   // ❌ Bad
   chrome.storage.local.get('auth')
   
   // ✅ Good
   chrome.storage.local.get(config.storage.auth)
   ```

3. **Feature flags**
   ```javascript
   // ❌ Bad
   if (process.env.NODE_ENV === 'development') {
     enableDebug();
   }
   
   // ✅ Good
   if (config.features.enableDebugMode) {
     enableDebug();
   }
   ```

## Troubleshooting

### 1. Config không đúng môi trường
- Kiểm tra `manifest.json` version
- Kiểm tra `NODE_ENV`
- Xem logs trong console

### 2. API URLs không đúng
- Kiểm tra `baseUrl` trong config
- Kiểm tra endpoint paths
- Verify full URLs trong `apiUrls`

### 3. Storage conflicts
- Kiểm tra storage keys khác nhau giữa dev/prod
- Clear storage nếu cần
- Kiểm tra version migrations
