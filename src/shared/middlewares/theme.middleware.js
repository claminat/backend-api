const path = require('path');

module.exports = function themeMiddleware(req, res, next) {
  // Ignore Chrome DevTools probing requests
  if (req.url.startsWith('/.well-known')) return next();

  if (!req.url.startsWith('/.well-known')) {
    console.log('⛳️ Current Theme:', res.locals.theme);
  }
  // [END]  Ignore Chrome DevTools probing requests

  // Tự động chọn theme theo route
  const isBlankTheme = ['/signin', '/signup'].some(path => req.path.includes(path));
  // const isBlankTheme = ['/signin', '/signup', '/auth/signin'].some(path => req.path.startsWith(path));

  res.locals.theme = isBlankTheme ? 'blank-theme' : 'light-theme';

  console.log('⛳️ Current Theme:', res.locals.theme);
  console.log('🧩 themeMiddleware attached to req.url =', req.url);


  res.renderPage = function (viewPath, options = {}) {
    const theme = res.locals.theme;

    // Gọi render nội dung chính
    res.render(viewPath, options, (err, html) => {
      console.log('🧪 Rendering viewPath:', viewPath);
      if (err) {
        console.error('❌ Error rendering view:', viewPath);
        return res.status(500).send(err.message);
      }

      // Sau đó render layout theme
      res.render(`${theme}/main`, {
        title: options.title || '',
        description: options.description || '',
        ...options,
        body: html
      });
    });
  };

  next();
};
