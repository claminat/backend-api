🗂️ Tài liệu Đặc Tả Yêu Cầu Dự Án: Media Manager Tool (Node.js)
🧩 Mục Tiêu
Xây dựng công cụ quản lý media (hình ảnh/video) trên nền Node.js kết hợp giao diện admin React (tokyo-free-white-react-admin-dashboard-js-main). Media có thể đến từ nhiều nguồn khác nhau như local, social network, hoặc lưu trữ đám mây (S3, Google Drive). Hệ thống có khả năng gắn tag, lọc, phân loại và phát hiện trùng lặp.

🧱 Kiến Trúc Tổng Quan
1. Frontend
ReactJS: sử dụng theme tokyo-free-white-react-admin-dashboard-js-main

Chức năng chính:

Giao diện table hiển thị media (ảnh/video)

Tìm kiếm, phân trang, lọc theo nguồn, tag, user, platform,...

Gắn tag đơn lẻ hoặc hàng loạt (bulk action)

Trang hiển thị các media bị trùng lặp (theo MD5)

2. Backend API (Node.js)
a. Database (tuỳ chọn)
✅ Phase 1: SQLite hoặc MongoDB

🗃️ Schema gợi ý: media collection/table

json
Copy
Edit
{
  "filename": "abc.jpg",
  "source": {
    "type": "facebook|instagram|x.com|local|gdrive|s3",
    "user": {
      "username": "...",
      "fullname": "..."
    }
  },
  "tags": ["funny", "news"],
  "color_tag": "red",
  "type": "image|video",
  "caption": "...",
  "size": 213902,
  "md5": "a7c1e7...",
  "paths": [
    "/Users/x/Desktop/Media1/abc.jpg",
    "/Users/x/Desktop/Media2/abc.jpg"
  ],
  "created_at": "2025-06-21T...",
  "updated_at": "2025-06-21T..."
}
b. Configurable Source Loader
File config (JSON hoặc .env) chứa:

✅ Nguồn local folder (đa thư mục)

✅ AWS S3 buckets

✅ Google Drive folder IDs

Tự động tải media từ các nguồn này về database.

c. API chính
Method	Endpoint	Chức năng
GET	/media	Lấy danh sách media, hỗ trợ phân trang, tìm kiếm
POST	/media/tag	Gắn tag cho 1 hoặc nhiều media
GET	/media/duplicates	Trả về danh sách media trùng (theo MD5)
POST	/media/import-social	API để extension gửi media từ social về
POST	/media/load-local	Load media từ local (theo config)
POST	/media/load-s3	Load media từ AWS S3
POST	/media/load-gdrive	Load media từ Google Drive

🎯 Chức Năng Chính
1. Giao diện quản lý media
Hiển thị danh sách media theo bảng (table)

Preview hình ảnh/video

Gắn tag: inline và bulk

Màu tag (color tag)

Tìm kiếm theo: tag, source, username, caption, type,...

2. Bulk Actions
Tích chọn tất cả trong trang hiện tại

Tích chọn tất cả theo kết quả lọc hiện tại (dựa theo từ khóa, tag, type,...)

Gắn tag hàng loạt

3. Phát hiện trùng lặp
Tính toán md5 cho mỗi file media

Trang hiển thị:

Hình ảnh gốc

Số lượng file trùng

Danh sách đường dẫn của các bản trùng

4. Nhận media từ Chrome Extension
Chrome extension tải hình ảnh/video từ:

X.com

Facebook

Instagram

Threads

Gửi POST request về /media/import-social

📝 Tham khảo cấu trúc media của WordPress
Áp dụng từ: https://developer.wordpress.org/rest-api/reference/media/

Thông tin tương đương:
title, caption, alt_text, source_url, media_type, mime_type, media_details,...

🔐 Các bước tiếp theo
✅ Xác nhận tài liệu này

📐 Thiết kế chi tiết cấu trúc thư mục, schema, API, UI component

🔨 Triển khai từng phase theo tiến độ (local → social → duplicate → UI full)

Bạn hãy xem kỹ nội dung trên và xác nhận "Đạt", hoặc yêu cầu chỉnh sửa từng phần trước khi mình đi vào giai đoạn triển khai chi tiết.








You said:
đặt nhưng tôi vẫn muốn triển khai chi tiết hơn về tài liệu này
hãy bắt đầu với schema - 🗃️ Schema gợi ý: media collection/table

chung ta sẽ có bao nhiêu schema, gồm những gì? chi tiết là gì?


ChatGPT said:
Tuyệt vời. Ta sẽ đi sâu vào thiết kế schema chi tiết cho hệ thống Media Manager.

🧱 Tổng Quan Về Schema
Trong phase này, chúng ta sẽ có 4 schema chính, dùng cho MongoDB (hoặc có thể chuyển thể sang SQLite nếu cần).

Tên Schema	Mục đích
Media	Lưu thông tin về hình ảnh/video
Tag	Lưu các tag để gắn vào media (tag quản lý độc lập)
UserSource	Lưu thông tin người dùng của social platform (username, fullname, platform)
SourceFolder	Lưu cấu hình thư mục/nguồn media từ local, S3, Google Drive

📄 1. Media Schema (Chính)
Mục đích:
Lưu trữ thông tin của từng file media (ảnh/video)

js
Copy
Edit
const MediaSchema = new Schema({
  filename: { type: String, required: true },
  extension: { type: String }, // .jpg, .mp4, etc
  type: { type: String, enum: ['image', 'video'], required: true },

  // Thông tin source
  source_type: { type: String, enum: ['local', 's3', 'gdrive', 'facebook', 'x', 'instagram', 'threads'], required: true },
  source_path: { type: String }, // Đường dẫn local hoặc URL tải về
  user_source: { type: Schema.Types.ObjectId, ref: 'UserSource' },

  // Thông tin metadata
  caption: { type: String },
  size: { type: Number }, // bytes
  width: { type: Number },
  height: { type: Number },
  mime_type: { type: String }, // eg. image/jpeg
  created_at: { type: Date, default: Date.now },

  // Tag
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  color_tag: { type: String }, // eg: 'red', 'green', ...

  // MD5
  md5: { type: String, required: true, index: true },

  // Trường bổ sung
  note: { type: String },
  duplicate_paths: [{ type: String }], // các file trùng lặp (same md5)

  // Trạng thái xử lý (cho các media import từ extension mà chưa gắn tag hay duyệt)
  status: { type: String, enum: ['new', 'reviewed'], default: 'new' }
});
🏷️ 2. Tag Schema
Mục đích:
Quản lý tag có thể gắn vào media, tách riêng để tái sử dụng, lọc dễ

js
Copy
Edit
const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});
👤 3. UserSource Schema
Mục đích:
Lưu thông tin người đăng bài hoặc liên quan tới media từ mạng xã hội

js
Copy
Edit
const UserSourceSchema = new Schema({
  platform: { type: String, enum: ['facebook', 'x', 'instagram', 'threads'], required: true },
  username: { type: String },
  fullname: { type: String },
  avatar_url: { type: String },
  profile_url: { type: String },
});
📁 4. SourceFolder Schema
Mục đích:
Lưu danh sách các folder local hoặc thông tin S3, GDrive để load media

js
Copy
Edit
const SourceFolderSchema = new Schema({
  name: { type: String },
  type: { type: String, enum: ['local', 's3', 'gdrive'], required: true },
  path_or_url: { type: String, required: true }, // local path, s3 bucket path, gdrive ID
  active: { type: Boolean, default: true },
  auto_scan: { type: Boolean, default: true }, // Có scan định kỳ không
  created_at: { type: Date, default: Date.now }
});
🔁 Mối Quan Hệ Các Schema
mermaid
erDiagram
  Media ||--|| Tag : "có thể có nhiều"
  Media }o--|| UserSource : "gắn với 1 user từ social"
  Media }o--|| SourceFolder : "được lấy từ 1 nguồn"
📝 Gợi ý lưu trữ media
File thực tế được lưu trong thư mục cấu hình hoặc được tải về lưu tại /media/<md5>.ext

Frontend truy cập thông qua API /media/file/:id

Bạn hãy xác nhận bản schema này đạt yêu cầu. Nếu đồng ý, bước tiếp theo sẽ là:

📦 Thiết kế cấu trúc thư mục backend

🛠️ Tạo mongoose models hoặc sqlite schemas

🔌 Viết các API CRUD cần thiết

Bạn muốn dùng MongoDB trước hay SQLite?


Hãy format câu trả lời với format file markdown
hãy thêm tiền tố social_network_ vào trước các schemas

social_network_media
social_network_user (đây là user cho social network)
social_network_post
social_network_tags
social_network_source_folder
