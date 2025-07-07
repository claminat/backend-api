






GET /media/list
   ⬇
Route: media.frontend.route.js
   - Định nghĩa URL /media/list
   - Gọi controller: getAllMediaPage()
   ⬇
Controller: media.frontend.controller.js
   - Gọi Service: getAll()
   - Nhận danh sách media
   - Gọi res.renderPage('media/views/list', { medias, title, ... })
   ⬇
Service: media.service.js
   - Hàm getAll() thực hiện truy vấn MongoDB (hoặc mock data)
   ⬇
Middleware: theme.middleware.js
   - Bọc nội dung của view `list.ejs` vào theme layout `main.ejs` tương ứng
   - Gọi res.render(`${theme}/main`, { ..., body: html })
   ⬇
View Layout: main.ejs (trong themes/light-theme hoặc blank-theme)
   - Chứa dòng: `<%- body %>` để nhúng view nội dung
   ⬇
View Page: list.ejs
   - Nhận biến `medias`, `title`, `description`
   - Binding vào HTML table trong view
