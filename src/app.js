const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const glob = require('glob');

const config = require('./shared/config');

const authRoute = require('./modules/auth/routes/auth.route');
const mediaRoute = require('./modules/media/routes/media.route');
const thirdPartyRoutes = require('./modules/thirdparty/routes/index');

// 🟡 ADD: Các route giao diện render EJS
const frontendRoutes = require('./routes/frontend.route');
const backendRoutes = require('./routes/backend.route');

const app = express();

// 🟢 KEEP: Middleware parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🟡 ADD: Serve static assets dùng chung (CSS, JS, images...)
app.use(express.static(path.join(__dirname, 'public')));

// 🟡 ADD: Cấu hình view engine EJS
app.set('view engine', 'ejs');

// 🟡 ADD: Load tất cả thư mục views trong modules
const moduleViews = glob.sync(path.join(__dirname, 'modules/*/views'));

// 🟡 ADD: Shared views từ theme & partials
const sharedViews = [
  path.join(__dirname, 'shared/views/themes/light-theme'),
  path.join(__dirname, 'shared/views/themes'),
  path.join(__dirname, 'shared/views/partials')
];
// ❌ console.log('📂 Views directories:', app.get('views'));

// 🟡 ADD: Đăng ký tất cả view paths
app.set('views', [...moduleViews, ...sharedViews]);


// 🟡 ADD: Middleware renderPage (theme wrapper)
const themeMiddleware = require('./shared/middlewares/theme.middleware');
app.use(themeMiddleware);

// 🟢 KEEP: Kết nối MongoDB
mongoose.connect(config.mongo.uri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));


// 🟡 ADD: Route render EJS
app.use('/', frontendRoutes);        // Giao diện người dùng
app.use('/api', backendRoutes);   // Giao diện admin



module.exports = app;
